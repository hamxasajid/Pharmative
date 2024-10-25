async function renderProducts() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    try {
        const response = await fetch('/Dashboard/data.json');
        const data = await response.json(); // Now it retrieves an object
        const products = data.products; // Access the products array

        products.forEach(product => {
            const productElement = `
                <div class="product">
                    <img src="../../Dashboard/public${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id}, '../../Dashboard/public${product.image}', '${product.name}', ${product.price})">Add to Cart</button>
                </div>`;
            productsContainer.innerHTML += productElement;
        });
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}


// Call renderProducts on page load
document.addEventListener('DOMContentLoaded', renderProducts);

// Cart functions (addToCart, updateCartBadge, showNotification, closeNotification)
function addToCart(id, image, title, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(p => p.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, image, title, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge(); // Update the badge
    showNotification(`${title} added to cart!`); // Show custom notification with product title
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    const badge = document.querySelector('.badge');
    badge.textContent = totalItems;
}

// Call this on page load to initialize the badge
updateCartBadge();

function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.message');
    messageElement.textContent = message;
    notification.style.display = 'flex';

    // Hide the notification after 3 seconds if not closed manually
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}
