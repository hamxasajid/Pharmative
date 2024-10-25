const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '/public/uploads/');
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    }
});
const upload = multer({ storage });

// Middleware to serve static files
app.use(express.static('public')); // Ensure this points to the public directory where your HTML files are stored
app.use(express.json());

// Function to get the next ID
const getNextId = (products) => {
    return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
};

// Endpoint to add a product
app.post('/add_product', upload.single('image'), (req, res) => {
    const newProduct = {
        id: getNextId([]), // Initialize ID as 1 for now
        name: req.body.name,
        price: parseFloat(req.body.price),
        image: `/uploads/${req.file.filename}` // Use the relative path for the uploaded image
    };

    fs.readFile(path.join(__dirname, './data.json'), (err, data) => {
        let jsonData = { products: [] };
        if (!err) {
            jsonData = JSON.parse(data);
        }
        newProduct.id = getNextId(jsonData.products); // Update ID to the next available
        jsonData.products.push(newProduct);
        fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to data file' });
            }
            res.status(201).json({ message: 'Product added successfully' });
        });
    });
});

// Endpoint to fetch all products
app.get('/products', (req, res) => {
    fs.readFile(path.join(__dirname, './data.json'), (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        }
        res.status(200).json(JSON.parse(data).products);
    });
});

// Endpoint to update a product
app.put('/update_product/:id', upload.single('image'), (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;

    // Validate the input
    if (!name || isNaN(price)) {
        return res.status(400).json({ message: 'Invalid product name or price' });
    }

    fs.readFile(path.join(__dirname, './data.json'), (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        }

        let jsonData = JSON.parse(data);
        const productIndex = jsonData.products.findIndex(product => product.id === productId);

        // Check if product exists
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product
        const updatedProduct = {
            ...jsonData.products[productIndex],
            name,
            price: parseFloat(price),
            image: req.file ? `/uploads/${req.file.filename}` : jsonData.products[productIndex].image // Update image only if a new file is uploaded
        };

        // Replace the old product with the updated one
        jsonData.products[productIndex] = updatedProduct;

        fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to data file' });
            }
            res.status(200).json({ message: 'Product updated successfully' });
        });
    });
});

// Endpoint to delete a product
app.delete('/delete_product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, './data.json'), (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        }
        let jsonData = JSON.parse(data);
        jsonData.products = jsonData.products.filter(product => product.id !== productId);
        fs.writeFile(path.join(__dirname, '../data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to data file' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        });
    });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public/uploads/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure data.json exists
const dataFilePath = path.join(__dirname, './data.json');
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ products: [] }, null, 2));
}

// Endpoint to serve admin dashboard (ensure you have admin.html in the public folder)
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/admin.html`);
});
