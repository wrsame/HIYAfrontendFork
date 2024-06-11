import { updateCartQuantityBadge } from './cartUtils.js';
import { getOneProduct, getLimitedProducts } from "../api/data/getData.js";
import { productSlider } from "./productSlider.js";
import { baseUrl } from "../api/requests.js";
import { newOrder } from './placeOrder.js';

let products = [];
let cart = [];

document.addEventListener("DOMContentLoaded", async function () {
    loadBasket();

    const testOrderBtn = document.querySelector(".create-test-order");
    testOrderBtn.addEventListener("click", placeOrder);

    const goToPayment = document.querySelector(".go-to-payment");
    goToPayment.addEventListener("click", () => {
        window.location.href = "/src/HTML/payment.html";
    });

    const products = await getLimitedProducts(8);
    productSlider(products, 'productSlider'); //productSlider is sectionId
});

async function loadBasket() {
    const basketContainer = document.getElementById('basket-container');
    basketContainer.innerHTML = "";  // Clear the basket container
    cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];

    if (cart.length === 0) {
        displayEmptyCart();
    } else {
        const productPromises = cart.map(item => getOneProduct(item.id));
        products = await Promise.all(productPromises);
        products.forEach((product, index) => {
            createProductRow(product, cart[index], basketContainer);
        });
        updateCartQuantityBadge();
        updateSubtotal();
    }
}

function displayEmptyCart() {
    const productsDiv = document.querySelector(".productsDiv");
    productsDiv.innerHTML = "";
    const div = document.createElement("div");
    div.className = "w-full flex flex-col justify-center items-center p-10 text-2xl text-light";
    div.innerHTML = "Din kurv er tom";

    const img = document.createElement("img");
    img.src = "https://cdn.dribbble.com/users/2058104/screenshots/4198771/media/6a7fbadba54f099e51e634281956fae0.jpg?resize=400x300&vertical=center";
    img.className = "w-5/12 lg:w-2/12";

    div.appendChild(img);
    productsDiv.appendChild(div);
}

function createProductRow(product, item, container) {
    const productRow = document.createElement('div');
    productRow.className = 'grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr] gap-4 items-center border-b border-gray-200 py-4';
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

    container.appendChild(productRow);

    const decrementButton = productRow.querySelector('.decrement-btn');
    const incrementButton = productRow.querySelector('.increment-btn');
    const quantityInput = productRow.querySelector('.quantity-input');
    const totalPriceElement = productRow.querySelector('.total-price');
    const deleteButton = productRow.querySelector('.delete-btn');

    decrementButton.addEventListener('click', () => updateQuantity(product.id, quantityInput, totalPriceElement, product.price, -1));
    incrementButton.addEventListener('click', () => updateQuantity(product.id, quantityInput, totalPriceElement, product.price, 1));
    deleteButton.addEventListener('click', () => removeProduct(productRow, product.id));
}

function updateQuantity(productId, quantityInput, totalPriceElement, unitPrice, delta) {
    let currentValue = parseInt(quantityInput.value);
    currentValue += delta;
    if (currentValue > 0) {
        quantityInput.value = currentValue;
        totalPriceElement.textContent = `${(currentValue * unitPrice).toLocaleString('da-DK')} kr`;
        updateLocalStorage(productId, currentValue);
    } else {
        removeProductFromCart(productId);
    }
    updateCartQuantityBadge();
    updateSubtotal();
}

function updateLocalStorage(productId, newQuantity) {
    cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
    const product = cart.find(item => item.id == productId);
    if (product) {
        product.quantity = newQuantity;
        localStorage.setItem('HIYAcart', JSON.stringify(cart));
    }
}

function removeProduct(productRow, productId) {
    productRow.remove();
    removeProductFromCart(productId);
    updateCartQuantityBadge();
    updateSubtotal();
    if (cart.length === 0) {
        displayEmptyCart();
    }
}

function removeProductFromCart(productId) {
    cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('HIYAcart', JSON.stringify(cart));
}

function updateSubtotal() {
    const subtotal = calculateSubtotal();
    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString('da-DK')} kr`;
}

function calculateSubtotal() {
    return cart.reduce((acc, item) => {
        const product = products.find(p => p.id === item.id);
        return product ? acc + (product.price * item.quantity) : acc;
    }, 0);
}

//TEST FUNCTION skal slettes
function placeOrder() {
    const customerId = 1; //this is for test
    const addressId = 1; //this is for test

    const subtotal = calculateSubtotal();
    newOrder(customerId, addressId, cart, subtotal);
}
