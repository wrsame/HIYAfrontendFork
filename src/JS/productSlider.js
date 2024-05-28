export function productSlider(products, sectionId) {
    const section = document.getElementById(sectionId);

    const productContainer = document.createElement('div');
    productContainer.className = 'product-container';

    // Add each product to the container
    products.forEach(product => {
        const productWrapper = document.createElement('div');
        productWrapper.className = 'productWrapper w-max h-auto m-3';

        const productImageWrapper = document.createElement('div');
        productImageWrapper.className ='w-44 h-44 lg:w-72 lg:h-72 border-2 relative' ;

        const productSpecialty = document.createElement('div');
        productSpecialty.className = 'productSpecialty absolute inset-2 text-sm';
        productSpecialty.innerText = product.specialtyText;

        const productImage = document.createElement('img');
        productImage.className = 'object-cover w-full h-full';
        productImage.src = product.imageUrl;
        productImage.alt = product.altText;

        const wishlistButton = document.createElement('button');
        wishlistButton.className = 'card-btn';
        wishlistButton.innerText = 'Køb';
        wishlistButton.style.outline = "none"

        productImageWrapper.appendChild(productSpecialty);
        productImageWrapper.appendChild(productImage);
        productImageWrapper.appendChild(wishlistButton);

        const productInfoWrapper = document.createElement('div');
        productInfoWrapper.className = 'w-full p-1 flex justify-between';

        const productPrice = document.createElement('p');
        productPrice.className = 'text-sm';
        productPrice.innerText = product.price;

        const productText = document.createElement('p');
        productText.className = 'text-sm';
        productText.innerText = product.text;

        productInfoWrapper.appendChild(productPrice);
        productInfoWrapper.appendChild(productText);

        productWrapper.appendChild(productImageWrapper);
        productWrapper.appendChild(productInfoWrapper);

        productContainer.appendChild(productWrapper);
    });

    section.appendChild(productContainer);

    // Add navigation buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'pre-btn outline-none';
    prevButton.innerHTML = '<i class="fa-solid fa-chevron-left" style="color: #000000;"></i>';

    const nextButton = document.createElement('button');
    nextButton.className = 'nxt-btn outline-none';
    nextButton.innerHTML = '<i class="fa-solid fa-chevron-right" style="color: #000000;"></i>';

    section.appendChild(prevButton);
    section.appendChild(nextButton);


    const productContainers = [...document.querySelectorAll('.product-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    productContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })

    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
})
}


