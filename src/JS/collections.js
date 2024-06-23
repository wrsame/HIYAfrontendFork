import { getProducts, getCollections } from "../api/data/getData.js";
import { baseUrl } from "../api/requests.js";

document.addEventListener("DOMContentLoaded", async function () {
    const products = await getProducts();
    const validCollections = await getCollections();
    const validCollectionNames = validCollections.map(collection => collection.name);

    initializeDropdown();
    initializePage(products, validCollectionNames);
});

//Filter/Sorteringslinje, funktionalitet ikke implementeret
function initializeDropdown() {
    const materialDropdown = document.getElementById("material-dropdown");
    const collectionDropdown = document.getElementById("collection-dropdown");

    materialDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleDropdown("dropdown-material-content");
    });

    collectionDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleDropdown("dropdown-collection-content");
    });

    window.addEventListener("click", function () {
        closeAllDropdowns();
    });
}
function toggleDropdown(className) {
    closeAllDropdowns();
    document.querySelectorAll(`.${className}`).forEach(dropdown => {
        dropdown.classList.toggle("show");
    });
}
function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-content").forEach(dropdown => {
        dropdown.classList.remove("show");
    });
}

function initializePage(products, validCollectionNames) {
    const productListDiv = document.getElementById("product-list");
    const collectionTitle = document.getElementById("collection-title");

    function updateHashBasedContent() {
        const hash = decodeURIComponent(window.location.hash.substring(1));
        const category = validCollectionNames.includes(hash) ? hash : "all";

        updateProductList(products, productListDiv, category);
        updateCollectionTitle(collectionTitle, category);
    }

    window.addEventListener("hashchange", updateHashBasedContent);
    updateHashBasedContent(); // Initial call
}

function updateProductList(products, productListDiv, category) {
    setCoverImage(category);

    const selectedProducts = category === 'all'
        ? products
        : products.filter(product => product.collections.some(collection => collection.name === category));

    productListDiv.innerHTML = "";

    selectedProducts.forEach(product => {
        const productElement = createProductElement(product);
        productListDiv.appendChild(productElement);
    });
}

function createProductElement(product) {
    const productWrapper = document.createElement('div');
    productWrapper.className = 'productWrapper w-min h-auto my-3 mx-2';

    const productImageWrapper = createProductImageWrapper(product);
    const productInfoWrapper = createProductInfoWrapper(product);

    productWrapper.appendChild(productImageWrapper);
    productWrapper.appendChild(productInfoWrapper);

    return productWrapper;
}

function createProductImageWrapper(product) {
    const productImageWrapper = document.createElement('div');
    productImageWrapper.className = 'w-40 h-44 lg:w-56 lg:h-60 border-2 relative cursor-pointer';

    const productSpecialty = document.createElement('div');
    productSpecialty.className = 'productSpecialty absolute inset-2 text-sm';
    productSpecialty.innerText = product.description;

    const productImage = document.createElement('img');
    productImage.className = 'object-cover w-full h-full';
    const primaryImage = product.images.find(image => image.is_primary);
    productImage.src = `${baseUrl}${primaryImage ? primaryImage.imageURL : product.images[0].imageURL}`;
    productImage.alt = product.altText;

    const buyButton = createBuyButton(product.id);

    //navigere til produkt-siden
    productImageWrapper.addEventListener('click', () => {
        window.location.href = `/src/html/collections/product.html?id=${product.id}`;
    });

    productImageWrapper.appendChild(productSpecialty);
    productImageWrapper.appendChild(productImage);
    productImageWrapper.appendChild(buyButton);

    return productImageWrapper;
}

function createBuyButton(productId) {
    const buyButton = document.createElement('button');
    buyButton.className = 'card-btn outline-none';
    buyButton.innerText = 'Se produkt';
    buyButton.style.outline = "none";
    buyButton.dataset.productId = productId;

    buyButton.addEventListener('click', function (event) {
        event.stopPropagation();
        window.location.href = `/src/html/collections/product.html?id=${productId}`;
    });

    return buyButton;
}

function createProductInfoWrapper(product) {
    const productInfoWrapper = document.createElement('div');
    productInfoWrapper.className = 'w-full p-1 flex justify-between';

    const productText = document.createElement('p');
    productText.className = 'text-sm w-2/4 break-words';
    productText.innerText = product.product_series.name;

    const productPrice = document.createElement('p');
    productPrice.className = 'text-sm';
    productPrice.innerText = `${product.price} dkk`;

    productInfoWrapper.appendChild(productText);
    productInfoWrapper.appendChild(productPrice);

    return productInfoWrapper;
}

function updateCollectionTitle(collectionTitle, category) {
    collectionTitle.textContent = category === "all" ? "Alle Smykker" : category;
}


function setCoverImage(category) {
    const img = document.querySelector('#coverImg');
    img.classList.remove('filter', 'grayscale');

    const imageUrls = {
        'Øreringe': 'https://cms-live-rc.pandora.net/resource/responsive-image/3044572/m37-hybrid-plp-hero-module/lg/3/q224-essence-product-02-hybridhero.jpg',
        'Halskæder': 'https://cms-live-rc.pandora.net/resource/responsive-image/3041118/m78-hero-module/lg/3/q224-essence-product-07-hero.jpg',
        'Armbånd': '/src/images/bracelets.png',
        'Sølv': 'https://cms-live-rc.pandora.net/resource/responsive-image/3041118/m78-hero-module/lg/3/q224-essence-product-07-hero.jpg',
        'default': 'https://www.tasaki-global.com/pub/media/catalog/category/jewellery/jewellery_collection_line_kv_v2.jpg'
    };

    img.src = imageUrls[category] || imageUrls['default'];

    if (category === 'Sølv') {
        img.classList.add('filter', 'grayscale');
    }
}
