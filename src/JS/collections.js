document.addEventListener("DOMContentLoaded", function () {

    setDropDown();

    const productList = document.getElementById("product-list");
    const collectionTitle = document.getElementById("collection-title");

    const products = [
        {
            id: 1,
            imageUrl: 'https://nominalx.com/cdn/shop/files/WR-VERILY-G_900x.png?v=1715914607',
            altText: 'Product 1',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: '',
            category: 'ring',
            name: 'Guldring'
        },
        {
            id: 2,
            imageUrl: 'https://nominalx.com/cdn/shop/files/CustomNameSarah_900x.jpg?v=1710288477',
            altText: 'Product 2',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'necklaces',
            name: 'Sølvhalskæde'
        },
        {
            id: 3,
            imageUrl: 'https://nominalx.com/cdn/shop/products/AyatulKursiCuff_900x.jpg?v=1651015366',
            altText: 'Product 3',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'earrings',
            name: 'Diamantøreringe'
        },
        {
            id: 4,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        }
        ,
        {
            id: 5,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        }
        ,
        {
            id: 6,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        },
        {
            id: 7,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        },
        {
            id: 8,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        },
        {
            id: 9,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        }
        ,
        {
            id: 10,
            imageUrl: 'https://i.pinimg.com/564x/ba/5e/01/ba5e01fc88758ff92489bfd2ed74d6dc.jpg',
            altText: 'Product 4',
            price: '299 dkk',
            text: 'tekst',
            specialtyText: 'TEKST',
            category: 'bracelets',
            name: 'Læderarmbånd'
        }
    ];

    function updateProductList(category) {
        setCoverImg(category);
        const selectedProducts = category === 'all' ? products : products.filter(product => product.category === category);

        productList.innerHTML = "";

        selectedProducts.forEach(product => {
            const productWrapper = document.createElement('div');
            productWrapper.className = 'productWrapper w-max h-auto my-3 mx-2';

            const productImageWrapper = document.createElement('div');
            productImageWrapper.className = 'w-40 h-44 lg:w-56 lg:h-60 border-2 relative';

            const productSpecialty = document.createElement('div');
            productSpecialty.className = 'productSpecialty absolute inset-2 text-sm';
            productSpecialty.innerText = product.specialtyText;

            const productImage = document.createElement('img');
            productImage.className = 'object-cover w-full h-full';
            productImage.src = product.imageUrl;
            productImage.alt = product.altText;

            const buyButton = document.createElement('button');
            buyButton.className = 'card-btn outline-none';
            buyButton.innerText = 'Køb';
            buyButton.style.outline = "none";
            buyButton.dataset.productId = product.id; // Add product ID to button

            // Add event listener to redirect to the product page
            buyButton.addEventListener('click', function() {
                window.location.href = `/src/html/collections/product.html?id=${product.id}`;
            });

            productImageWrapper.appendChild(productSpecialty);
            productImageWrapper.appendChild(productImage);
            productImageWrapper.appendChild(buyButton);

            const productInfoWrapper = document.createElement('div');
            productInfoWrapper.className = 'w-full p-1 flex justify-between';

            const productPrice = document.createElement('p');
            productPrice.className = 'text-sm';
            productPrice.innerText = product.price;

            const productText = document.createElement('p');
            productText.className = 'text-sm';
            productText.innerText = product.name;

            productInfoWrapper.appendChild(productPrice);
            productInfoWrapper.appendChild(productText);

            productWrapper.appendChild(productImageWrapper);
            productWrapper.appendChild(productInfoWrapper);

            productList.appendChild(productWrapper);
        });

        collectionTitle.textContent = category === "all" ? "Alle Smykker" : category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Check URL hash to determine category
    function checkHash() {
        const hash = window.location.hash.substring(1);
        const category = hash ? hash : "all";
        updateProductList(category);
    }

    window.addEventListener("hashchange", checkHash);
    checkHash(); // Initial call to set the products
});




function setCoverImg(category) {
    console.log(category);
    const img = document.querySelector('#coverImg');
    switch (category) {
        case 'earrings':
        img.src = 'https://www.tasaki-global.com/pub/media/catalog/category/jewellery/jewellery_collection_line_kv_v2.jpg';
        break;
        case 'necklaces':
        img.src = 'https://www.tasaki-global.com/pub/media/catalog/category/jewellery/jewellery_collection_line_kv_v2.jpg';
        break;
        case 'bracelets':
        img.src = 'https://www.tasaki-global.com/pub/media/catalog/category/jewellery/jewellery_collection_line_kv_v2.jpg';
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
        event.stopPropagation(); // Prevent event from bubbling up
        console.log("Materiale dropdown toggled");
        toggleDropdown("dropdown-material-content");
    });

    collectionDropdown.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
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

    // Close dropdowns if the user clicks outside of them
    window.addEventListener("click", function () {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("show");
        }
    });
        }
          