import { getProducts, getCollections } from "../api/data/getData.js"
import {baseUrl} from "../api/requests.js"

document.addEventListener("DOMContentLoaded", async function () {

    const products = await getProducts()
    const validCollections = await getCollections()
    const validCollectionNames = validCollections.map(x => {return x.name})
    
    setDropDown();

    const productList = document.getElementById("product-list");
    const collectionTitle = document.getElementById("collection-title");

    function updateProductList(category) {
        setCoverImg(category);
        const selectedProducts = category === 'all' 
            ? products 
            : products.filter(product => product.collections.some(collection => collection.name === category));
        
        productList.innerHTML = "";

        selectedProducts.forEach(product => {
            const productWrapper = document.createElement('div');
            productWrapper.className = 'productWrapper w-min h-auto my-3 mx-2';
        
            const productImageWrapper = document.createElement('div');
            productImageWrapper.className = 'w-40 h-44 lg:w-56 lg:h-60 border-2 relative cursor-pointer';
        
            const productSpecialty = document.createElement('div');
            productSpecialty.className = 'productSpecialty absolute inset-2 text-sm';
            productSpecialty.innerText = product.description;
        
            const productImage = document.createElement('img');
            productImage.className = 'object-cover w-full h-full';
            const primaryImage = product.images.find(image => image.is_primary);
            if (primaryImage) {
                productImage.src = `${baseUrl}${primaryImage.imageURL}`;
            } else {
                productImage.src = `${baseUrl}${product.images[0].imageURL}`;
            }
            productImage.alt = product.altText;
        
            const buyButton = document.createElement('button');
            buyButton.className = 'card-btn outline-none';
            buyButton.innerText = 'Se produkt';
            buyButton.style.outline = "none";
            buyButton.dataset.productId = product.id;
        
            // Add event listener to redirect to the product page
            buyButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent the event from bubbling up to the wrapper
                window.location.href = `/src/html/collections/product.html?id=${product.id}`;
            });
        
            // Add event listener to the image wrapper to redirect to the product page
            productImageWrapper.addEventListener('click', function() {
                window.location.href = `/src/html/collections/product.html?id=${product.id}`;
            });
        
            productImageWrapper.appendChild(productSpecialty);
            productImageWrapper.appendChild(productImage);
            productImageWrapper.appendChild(buyButton);
        
            const productInfoWrapper = document.createElement('div');
            productInfoWrapper.className = 'w-full p-1 flex justify-between';
        
            const productText = document.createElement('p');
            productText.className = 'text-sm w-2/4 break-words';
            productText.innerText = product.product_series.name;
        
            const productPrice = document.createElement('p');
            productPrice.className = 'text-sm';
            productPrice.innerText = product.price + " dkk";
        
            productInfoWrapper.appendChild(productText);
            productInfoWrapper.appendChild(productPrice);
        
            productWrapper.appendChild(productImageWrapper);
            productWrapper.appendChild(productInfoWrapper);
        
            productList.appendChild(productWrapper);
        });
        

    }


    function checkHash() {
        const hash = decodeURIComponent(window.location.hash.substring(1));
        let category = validCollectionNames.includes(hash) ? hash : "all";
        
        updateProductList(category);
        collectionTitle.textContent = category === "all" ? "Alle Smykker" : category.charAt(0).toUpperCase() + category.slice(1);
    }

    window.addEventListener("hashchange", checkHash);
    checkHash(); // Initial call 
});


function setCoverImg(category) {

    const img = document.querySelector('#coverImg');
    img.classList.remove('filter', 'grayscale');
    switch (category) {
        case 'Øreringe':
        img.src = 'https://cms-live-rc.pandora.net/resource/responsive-image/3044572/m37-hybrid-plp-hero-module/lg/3/q224-essence-product-02-hybridhero.jpg';
        break;
        case 'Halskæder':
        img.src = 'https://cms-live-rc.pandora.net/resource/responsive-image/3041118/m78-hero-module/lg/3/q224-essence-product-07-hero.jpg';
        break;
        case 'Armbånd':
        img.src = '/src/images/bracelets.png';
        break;
        case 'Sølv':
        img.src = 'https://cms-live-rc.pandora.net/resource/responsive-image/3041118/m78-hero-module/lg/3/q224-essence-product-07-hero.jpg';
        img.classList.add('filter', 'grayscale');
        break;
        default:
        img.src = 'https://www.tasaki-global.com/pub/media/catalog/category/jewellery/jewellery_collection_line_kv_v2.jpg';
        break;
        }
    }
   

    function setDropDown(){

    const materialDropdown = document.getElementById("material-dropdown");
    const collectionDropdown = document.getElementById("collection-dropdown");

    materialDropdown.addEventListener("click", function (event) {
        event.stopPropagation(); 
        console.log("Materiale dropdown toggled");
        toggleDropdown("dropdown-material-content");
    });

    collectionDropdown.addEventListener("click", function (event) {
        event.stopPropagation(); 
        console.log("Kollektion dropdown toggled");
        toggleDropdown("dropdown-collection-content");
    });

    function toggleDropdown(className) {
        // Close other open dropdowns
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains("show") && !dropdowns[i].classList.contains(className)) {
                dropdowns[i].classList.remove("show");
            }
        }

        // Toggle the target dropdown
        var targetDropdowns = document.getElementsByClassName(className);
        for (var i = 0; i < targetDropdowns.length; i++) {
            targetDropdowns[i].classList.toggle("show");
            console.log("Dropdown toggled: ", className);
        }
    }


    window.addEventListener("click", function () {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("show");
        }
    });
        }
          