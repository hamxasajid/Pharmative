function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cartTable tbody');
    const grandTotalElement = document.getElementById('grandTotal');
    let grandTotal = 0;

    cartTableBody.innerHTML = ''; // Clear any existing rows

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="6">Your cart is empty</td></tr>';
        grandTotalElement.textContent = 'Grand Total: $0.00';
        updateCartBadge(); // Ensure the badge is updated if the cart is empty
        return;
    }

    cart.forEach(cartItem => {
        if (!cartItem.id || !cartItem.image || !cartItem.title || !cartItem.price) {
            console.error(`Invalid cart item: ${JSON.stringify(cartItem)}`);
            return; // Skip invalid items
        }

        const total = (cartItem.price * cartItem.quantity).toFixed(2);
        grandTotal += parseFloat(total);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${cartItem.image}" alt="${cartItem.title}" style="width: 80px; height: auto;"></td>
            <td>${cartItem.title}</td>
            <td>$${cartItem.price.toFixed(2)}</td>
            <td>
                <div class="quantity-container">
                    <button class="quantity-btn" onclick="updateQuantity(${cartItem.id}, ${cartItem.quantity - 1})">-</button>
                    <input type="number" value="${cartItem.quantity}" min="1" onchange="updateQuantity(${cartItem.id}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${cartItem.id}, ${cartItem.quantity + 1})">+</button>
                </div>
            </td>
            <td>$${total}</td>
            <td><button class="remove-btn" onclick="removeFromCart(${cartItem.id}, ${cartItem.quantity})">&times;</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    grandTotalElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
    updateCartBadge(); // Update the cart badge after displaying the cart
}

function updateQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(p => p.id === productId);

    if (product && quantity > 0) {
        product.quantity = parseInt(quantity, 10);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart(); // Refresh the cart display
    }
}

function removeFromCart(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // Refresh the cart display and update the badge automatically
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.shop .badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    badge.textContent = totalItems;
}

// Initialize the cart on page load
window.onload = displayCart;
