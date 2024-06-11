import { updateCartQuantityBadge } from "./cartUtils.js";
import { getOneProduct, getProductsByProductSeries, getLimitedProducts } from "../api/data/getData.js"
import { productSlider } from "./productSlider.js";
import {baseUrl} from "../api/requests.js"


document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = await getOneProduct(productId)
    console.log("product: ", product);

    showImages(product.images)
    imgSliderOnMobile(product.images)

    const buyButton = document.querySelector(".buybutton")
    const productQuantity = document.querySelector(".productQuantity")

    buyButton.addEventListener("click", function () {
        const quantity = parseInt(productQuantity.value);

        if (quantity > 0) {

            let cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
            const existingProduct = cart.find(item => item.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({ id: product.id, quantity: quantity });
            }
            localStorage.setItem('HIYAcart', JSON.stringify(cart));
            buyButton.style.outline = "none"
            buyButton.innerText = "Tilføjet";
            buyButton.classList.add("primary-light-col");
            updateCartQuantityBadge()

           //resets btn
            setTimeout(() => {
                buyButton.innerText = "Køb";
                buyButton.classList.remove("primary-light-col");
            }, 1000);

        } else {
            alert("Fejl, prøv igen");
        }
    });

    if (product) {
        fillProductDetails(product)
        productsByProductSeries(product.product_series.id)
        
    }

    const products = await getLimitedProducts(8)
    productSlider(products, 'productSlider');  //productSlider is sectionId

   
});

function showImages(urls) {
   
    const imgBox = document.querySelector(".imagesBox")

    urls.forEach(x => {
      
        const div = document.createElement('div');
        div.className = 'w-1/2 p-1';

        const img = document.createElement('img');
        img.src = `${baseUrl}${x.imageURL}`;

        img.className = 'w-full h-full object-cover';

        div.appendChild(img);
        imgBox.appendChild(div);
    });
}

function imgSliderOnMobile(urls) {
    

    const swiperWrapper = document.querySelector(".swiper-wrapper")
    urls.forEach(x => {

        const swiperslide = document.createElement('div');
        swiperslide.className = "swiper-slide flex"

        const div = document.createElement('div');
        div.className = 'flex justify-center items-center';

        const img = document.createElement('img');
        img.src = `${baseUrl}${x.imageURL}`;
        img.className = 'w-full h-6/12 object-cover';


        div.appendChild(img);
        swiperslide.appendChild(div)
        swiperWrapper.appendChild(swiperslide);
    });

}

function fillProductDetails(product) {

    const productName = document.querySelector('.productName')
    const priceTag = document.querySelector('.priceTag')
    const chosenMaterial = document.querySelector('.chosenMaterial')

    chosenMaterial.innerText = "Vælg Materiale: " + product.material.name
    priceTag.innerText = product.price
    productName.innerText = product.product_series.name

}

async function productsByProductSeries(id){

    const productsBySeries = await getProductsByProductSeries(id)
    fillMaterials(productsBySeries)
}

function fillMaterials(products) {
    const materialsBox = document.querySelector('.materialsBox');
    materialsBox.innerHTML=""
    let src = "";

    products.forEach(product => {
        console.log(product);

        if (product.material.name === "18k Guldbelagt Sterling Sølv") {
            src = "https://img.freepik.com/free-vector/gradient-solid-gold-background_23-2150993766.jpg?size=626&ext=jpg&ga=GA1.1.44546679.1716854400&semt=sph";
        } else {
            src = "https://as1.ftcdn.net/v2/jpg/02/07/13/36/1000_F_207133679_tGuezrUoWSoJtNfxXaaK4jSrXpZHNqr6.jpg"; 
        }

        const a = document.createElement('a');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('id', product.id);
        a.href = newUrl.toString();

        const img = document.createElement('img');
        img.src = src;
        img.className = 'rounded-sm w-8 h-8 border border-gray-300 cursor-pointer material-box';

        // Append the image to the anchor
        a.appendChild(img);

        // Append the anchor to the materials box
        materialsBox.appendChild(a);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const decrementButton = document.querySelector('.decrement-btn');
    const incrementButton = document.querySelector('.increment-btn');
    const quantityInput = document.querySelector('.quantity-input');

    decrementButton.addEventListener('click', function () {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    incrementButton.addEventListener('click', function () {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    const materialBtns = document.querySelectorAll('.material-box');

    materialBtns.forEach(material => {
        material.addEventListener('click', () => {
            selectMaterial(material);
        });
    });

    function selectMaterial(element) {
        // Fjern 'selected' klassen fra alle billeder
        materialBtns.forEach(material => {
            material.classList.remove('border-black');
            material.classList.add('border-gray-300');
        });

        // Tilføj 'selected' klassen til det klikkede billede
        element.classList.remove('border-gray-300');
        element.classList.add('border-black');
    }
});

// følgende kode SKAL BLIVE HER ---------

var swiper = new Swiper(".default-carousel", {
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
