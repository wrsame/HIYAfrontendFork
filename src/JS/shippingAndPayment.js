import { getOneProduct, getCustomerAddresses } from "../api/data/getData.js";
import { baseUrl } from "../api/requests.js";
import { createAddress } from "../api/data/postData.js";
import { newOrder } from './placeOrder.js';

const customerName = document.querySelector(".Customer-name")
const customerEmail = document.querySelector(".Customer-email")
const customerPhone = document.querySelector(".Customer-phone")

const savedAddressesDropdown = document.getElementById("saved-addresses");
const newAddressBtn = document.getElementById("new-address-btn");
const addressForm = document.getElementById("address-form");
const loadingIndicator = document.getElementById("loading-indicator");

let cart = []
let products = []


document.addEventListener("DOMContentLoaded", async () => {
    
    const customer = JSON.parse(sessionStorage.getItem('customer-HIYA'));
    if (!customer){ window.location.href = '/src/html/loginAndRegistration.html'}
    
    customerEmail.textContent = customer.email
    customerName.textContent = customer.firstName + " " + customer.lastName
    customerPhone.textContent = customer.phone

    loadBasket()

    const paymentForm = document.querySelector(".payment-form");
    const addressForm = document.querySelector(".address-form");
    const submitButton = paymentForm.querySelector("button[type='submit']");

    submitButton.addEventListener("click", async function (event) {
        event.preventDefault();
        if (!addressForm.checkValidity()) {
            event.preventDefault();
            addressForm.reportValidity();
        }
        else{
            handleOrderProcess(customer)
        }
    });

    //----henter addresser----

    try {
        const addresses = await getCustomerAddresses(customer.id)
        if (addresses.length > 0) {
            populateAddressDropdown(addresses);
        }
       
        savedAddressesDropdown.addEventListener("change", (event) => {
            const selectedAddressId = event.target.value;
            
            if (selectedAddressId) {
                const selectedAddress = addresses.find(addr => addr.id == selectedAddressId);
                fillFormWithAddress(selectedAddress);
                const inputs = addressForm.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.classList.add("bg-gray-100");
                        input.style.outline = "none";
                    });
                    savedAddressesDropdown.classList.remove("bg-gray-100")
            } 
            else {
                resetForm();
            }
        });
    
        // Event listener til "ny adresse" knap
        newAddressBtn.addEventListener("click", resetForm);

    } catch (error) {
        console.error("Error fetching addresses:", error);
    }
   
})

async function loadBasket() {
     cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];

    if (cart.length === 0) {
        window.location.href="/";
    } else {
        const productPromises = cart.map(item => getOneProduct(item.id));
        products = await Promise.all(productPromises);
        displayProducts(products)
        displayProductsMobile(products)
        updateSubtotal(products)
    }
}

async function handleOrderProcess(customer) {
    try {
        loadingIndicator.classList.remove("hidden");

        // Gennemfør betaling først...

        // Post adresse
        let addressId = savedAddressesDropdown.value 
            ? savedAddressesDropdown.value 
            : (await newCustomerAddress(customer.id)).id;

        if (addressId) {
            let order = await placeOrder(customer.id, addressId);
            if (order.id) {
                confirmOrder(order.id);
            }
        }
    } catch (error) {
        console.error("Fejl under ordreprocessen:", error);
    } finally {
        
        loadingIndicator.classList.add("hidden");
    }
}

function createProductHTML(product) {
    const productHTML = `
            <div class="flex items-center mb-6">
                <img src="${baseUrl}${product.images.find(img => img.is_primary).imageURL}" alt="Product Image" class="h-16 w-16 rounded-xs">
                <div class="ml-4">
                    <h3 class="text-lg ">${product.product_series.name}</h3>
                    <p class="text-gray-500 text-sm">${product.material.name}</p>
                </div>
                <span class="ml-auto text-lg ">${parseFloat(product.price).toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</span>
            </div>
    `;
    return productHTML;
}

function createProductHTMLMobile(product) {
    return `
        <div class=" flex-shrink-0 w-32">
            <div class="flex justify-center">
                <img src="${baseUrl}${product.images.find(img => img.is_primary).imageURL}" alt="Product Image" class="h-32 w-full object-cover rounded-xs">
            </div>
            <div class="text-center mt-1">
                <h3 class="text-xs text-gray-400">${product.product_series.name}</h3>
            </div>
        </div>
    `;
}

function displayProductsMobile(products) {
    const container = document.querySelector('.products-container-mobile');
    container.innerHTML = ''; 
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'flex overflow-x-auto space-x-1';

    products.forEach(product => {
        sliderWrapper.innerHTML += createProductHTMLMobile(product);
    });

    container.appendChild(sliderWrapper);
}

function displayProducts(products) {
    const container = document.querySelector('.products-container');
    container.innerHTML = ''; 
    products.forEach(product => {
        container.innerHTML += createProductHTML(product);
    });
}

function updateSubtotal() {
    const subtotal = calculateSubtotal();
    document.querySelectorAll('.subtotal').forEach(element => {
        element.textContent = `${subtotal.toLocaleString('da-DK')} DKK`;
    });
}

function calculateSubtotal() {
    return cart.reduce((acc, item) => {
        const product = products.find(p => p.id === item.id);
        return product ? acc + (product.price * item.quantity) : acc;
    }, 0);
}

async function newCustomerAddress(customerId){

    const addressForm = document.getElementById('address-form');
            const formData = new FormData(addressForm);

            let data = {
                customer_id: customerId,
                name: formData.get('name'),
                street: formData.get('address') + " " + formData.get('apartment'),
                city: formData.get('city'),
                region: formData.get('region'),
                postalcode: formData.get('postalcode'),
                country: formData.get('country')
            }
             try {
                const address = await createAddress(data);
                console.log('Adresse blev oprettet!');
                return address
            } catch (error) {
                console.error('Fejl ved oprettelse af adresse:', error);
                alert('Der opstod en fejl ved oprettelse af adresse.');
            
            }
}

async function placeOrder(customerId, addressId) {
    const subtotal = calculateSubtotal()
    return await newOrder(customerId, addressId, cart, subtotal);
}

function confirmOrder(orderId) {
    const subtotal = calculateSubtotal()
    const mainContent = document.querySelector(".mainContent");
    mainContent.innerHTML = "";

    const div = document.createElement("div");
    div.className = "flex flex-col justify-center items-center p-20";
    
    
    const thankYouMessage = document.createElement("h1");
    thankYouMessage.className = "text-4xl font-bold mb-6";
    thankYouMessage.textContent = "Tak for din ordre!";
    div.appendChild(thankYouMessage);

  
    const orderIdMessage = document.createElement("h2");
    orderIdMessage.className = "text-2xl mb-4";
    orderIdMessage.textContent = `Ordre #${orderId}`;
    const subTotal = document.createElement("h2")
    subTotal.className = "text-1xl mb-4"
    subTotal.textContent =`Total: ${subtotal} DKK`;
    div.appendChild(orderIdMessage);
    div.appendChild(subTotal);
   
    const productsContainer = document.createElement("div");
    productsContainer.className = "flex flex-wrap justify-center items-start space-x-4";
    div.appendChild(productsContainer);


    products.forEach((product, index) => {
        let item = cart[index]; // Assuming `cart` is available in this scope
        const productDiv = document.createElement("div");
        productDiv.className = "p-4 border rounded shadow-lg m-2 w-64";

        const productImageDiv = document.createElement("div");
        productImageDiv.className = "flex justify-center";
        const productImage = document.createElement("img");
        productImage.src = `${baseUrl}${product.images.find(img => img.is_primary).imageURL}`;
        productImage.alt = "Product Image";
        productImage.className = "h-32 w-32 object-cover rounded-xs";
        productImageDiv.appendChild(productImage);
        productDiv.appendChild(productImageDiv);

        const productName = document.createElement("h3");
        productName.className = "text-lg font-semibold mb-1 text-center";
        productName.textContent = product.product_series.name;
        productDiv.appendChild(productName);

        const productQuantity = document.createElement("p");
        productQuantity.className = "text-sm mb-1 text-center";
        productQuantity.textContent = `${item.quantity}x`;
        productDiv.appendChild(productQuantity);

        const productPrice = document.createElement("p");
        productPrice.className = "text-sm text-center";
        productPrice.textContent = `${(product.price * item.quantity).toLocaleString('da-DK')} kr`;
        productDiv.appendChild(productPrice);

        productsContainer.appendChild(productDiv);
    });

    mainContent.appendChild(div);

    //for at resette kurv
    localStorage.removeItem('HIYAcart');
}


//------------ Addresse drop down ------------

// Udfylde dropdown med adresser
function populateAddressDropdown(addresses) {
    document.querySelector(".addresses-dropdown-div").classList.remove("hidden")
    addresses.forEach(address => {
        const option = document.createElement("option");
        option.value = address.id;
        option.textContent = `${address.street}, ${address.city}`;
        savedAddressesDropdown.appendChild(option);
    });
}

// Udfylde formular med valgt adresse
function fillFormWithAddress(address) {

    document.getElementById("name").value = address.name;
    document.getElementById("country").value = address.country;
    document.getElementById("company").value = address.company || "";
    document.getElementById("address").value = address.street;
    document.getElementById("apartment").value = address.apartment || "";
    document.getElementById("postalcode").value = address.postalcode;
    document.getElementById("city").value = address.city;
    document.getElementById("region").value = address.region;

    //htmlCollection til liste
    Array.from(addressForm.elements).forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
            el.readOnly = true;
        }
    });

    newAddressBtn.classList.remove("hidden");
}

function resetForm() {
    addressForm.reset();

    Array.from(addressForm.elements).forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
            el.readOnly = false;
        }
    });

    newAddressBtn.classList.add("hidden");
    const inputs = addressForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove("bg-gray-100");
    });
}
