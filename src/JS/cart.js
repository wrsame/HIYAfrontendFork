import { updateCartQuantityBadge } from './cartUtils.js';
import { getOneProduct } from "../api/data/getData.js"
import {baseUrl} from "../api/requests.js"

let products = [];

document.addEventListener("DOMContentLoaded", function () {
    loadBasket();
});

async function loadBasket() {
    const basketContainer = document.getElementById('basket-container');
    const cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];

    if (cart.length == 0){
        const productsDiv = document.querySelector(".productsDiv")
        productsDiv.innerHTML=""
        const div = document.createElement("div")
        div.className = "w-full flex flex-col justify-center items-center p-10 text-2xl text-light"
        div.innerHTML = "Din kurv er tom"
        
        const img = document.createElement("img")
        img.src = "https://cdn.dribbble.com/users/2058104/screenshots/4198771/media/6a7fbadba54f099e51e634281956fae0.jpg?resize=400x300&vertical=center"
        img.className = "w-5/12 lg:w-2/12"

        div.appendChild(img)
        productsDiv.appendChild(div)
    }

    else {
        const productPromises = cart.map(item => getOneProduct(item.id));
        products = await Promise.all(productPromises);

        products.forEach((product, index) => {
            const item = cart[index]; 
            console.log(product);

            
                const productRow = document.createElement('div');
                productRow.className = 'grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] gap-4 items-center border-b border-gray-200 py-4';
                productRow.dataset.productId = product.id;

                productRow.innerHTML = `
                    <div class="flex items-center">
                        <img src="${baseUrl}${product.images[0].imageURL}" alt="${product.altText}" class="w-24 h-24 object-cover mr-4">
                        <div>
                        <a href="/src/html/collections/product.html?id=${product.id}" class="hover:underline"><p class="text-lg font-semibold">${product.product_series.name}</p></a>

                            <p class="text-gray-500">${product.price.toLocaleString('da-DK')} kr</p>
                            <p class="text-gray-500 text-sm">Materiale: ${product.material.name}</p>
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <button class="px-3 py-2 border border-gray-400 decrement-btn" style="outline: none;">-</button>
                        <input type="text" value="${item.quantity}" class="w-12 text-center py-2 border-t border-b border-gray-400 quantity-input">
                        <button class="px-3 py-2 border border-gray-400 increment-btn" style="outline: none;">+</button>
                        <button class="ml-4 delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-semibold total-price">${(product.price * item.quantity).toLocaleString('da-DK')} kr</p>
                    </div>
                `;

                basketContainer.appendChild(productRow);

                // increment and decrement buttons
                const decrementButton = productRow.querySelector('.decrement-btn');
                const incrementButton = productRow.querySelector('.increment-btn');
                const quantityInput = productRow.querySelector('.quantity-input');
                const totalPriceElement = productRow.querySelector('.total-price');

                decrementButton.addEventListener('click', function () {
                    let currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        updateTotalPrice(quantityInput, totalPriceElement, product.price);
                    }
                });

                incrementButton.addEventListener('click', function () {
                    let currentValue = parseInt(quantityInput.value);
                    quantityInput.value = currentValue + 1;
                    updateTotalPrice(quantityInput, totalPriceElement, product.price);
                });

                //  delete button
                const deleteButton = productRow.querySelector('.delete-btn');
                deleteButton.addEventListener('click', function () {
                    const productId = productRow.dataset.productId;
                    removeProductFromCart(productId);
                    productRow.remove();
                    updateCartQuantityBadge();
                });
        });

        
        getSubtotal();
    }
}

// Update total price based on quantity
function updateTotalPrice(quantityInput, totalPriceElement, unitPrice) {
    const quantity = parseInt(quantityInput.value);
    const totalPrice = quantity * unitPrice;
    totalPriceElement.textContent = `${totalPrice.toLocaleString('da-DK')} kr`;
    const productId = quantityInput.closest('.grid').dataset.productId;
    updateLocalStorage(productId, quantity);
    updateCartQuantityBadge();
    getSubtotal(); // Opdater subtotalen når mængden ændres
}

// Update localStorage with the new quantity
function updateLocalStorage(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
    const product = cart.find(item => item.id == productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
        localStorage.setItem('HIYAcart', JSON.stringify(cart));
    }
}

// Remove product from localStorage
function removeProductFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('HIYAcart', JSON.stringify(cart));
    updateCartQuantityBadge();
    getSubtotal();
}


function getSubtotal() {
    const cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
    const subtotal = cart.reduce((acc, item) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            return acc + (product.price * item.quantity);
        } else {
            console.error(`Product with id ${item.id} not found`);
            return acc;
        }
    }, 0);
    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString('da-DK')} kr`;
}
