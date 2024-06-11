import { getCollections, getMaterials, getProductSeries } from "../api/data/getData.js";
import { createProductSeries, createProduct, uploadImages, saveImageUrls, addProductToCollection, setInventory } from "../api/data/postData.js";

const form = document.getElementById('productForm');

document.addEventListener('DOMContentLoaded', async () => {

    const collectionsDropdown = document.getElementById('collection');
    const materialsDropdown = document.getElementById('material');
    const productNameSelect = document.getElementById('productNameSelect');
    const productNameInput = document.getElementById('productName');
    const newProductNameSection = document.getElementById('newProductNameSection');
    const createNewProductBtn = document.getElementById('createNewProductBtn');
    const cancelNewProduct = document.getElementById('cancelNewProduct');

    try {
        const collections = await getCollections();
        console.log('Fetched collections:', collections);
        populateDropdown(collectionsDropdown, collections);
    } catch (error) {
        console.error('Error fetching collections:', error);
    }

    try {
        const materials = await getMaterials();
        console.log('Fetched materials:', materials);
        populateDropdown(materialsDropdown, materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
    }

    try {
        const productsSeries = await getProductSeries();
        console.log('Fetched products:', productsSeries);
        populateDropdown(productNameSelect, productsSeries, 'name');
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    createNewProductBtn.addEventListener('click', () => {
        newProductNameSection.style.display = 'block';
        productNameInput.required = true;
        productNameSelect.disabled = true;
        cancelNewProduct.style.display = 'inline';
    });

    cancelNewProduct.addEventListener('click', () => {
        newProductNameSection.style.display = 'none';
        productNameInput.value = '';
        productNameInput.required = false;
        productNameSelect.disabled = false;
        cancelNewProduct.style.display = 'none';
    });

    //----post form ---
    form.addEventListener('submit', postForm);

    async function postForm(event) {
        event.preventDefault();

        const formData = new FormData(form);
        let productSeriesId;

        if (productNameSelect.disabled && productNameInput.value) {
            try {
                const newProductSeries = await createProductSeries(formData.get('productName'));
                productSeriesId = newProductSeries.id;
            } catch (error) {
                console.error("Fejl ved oprettelse af produktserie:", error);
                alert('Der opstod en fejl ved oprettelse af produktserien.');
                return;
            }
        } else {
            productSeriesId = formData.get('productNameSelect');
        }

        try {
            const productData = {
                product_series_id: productSeriesId,
                material_id: formData.get('material'),
                description: formData.get('description'),
                price: formData.get('price')
            };

            const data = await createProduct(productData);

            const primaryImage = formData.get('primaryImage');
            const images = formData.getAll('images');
            const combinedFormData = new FormData();

            if (primaryImage) {
                combinedFormData.append('images[]', primaryImage);
            }

            images.forEach((image) => {
                combinedFormData.append('images[]', image);
            });

            // console.log("Combined FormData for upload: ", Array.from(combinedFormData.entries()));
            const uploadedURLs = await uploadImages(combinedFormData);
            console.log("Uploaded URLs: ", uploadedURLs);

            const allImages = [];
            uploadedURLs.forEach((url, index) => {
                allImages.push({
                    url: url,
                    isPrimary: index === 0 && primaryImage ? true : false
                });
            });
            console.log("allImages: ", allImages);
            await saveImageUrls(data.product.id, allImages);

            const selectedCollections = Array.from(formData.getAll('collection'));
            const collectionPromises = selectedCollections.map(collectionId => addProductToCollection(data.product.id, collectionId));
            await Promise.all(collectionPromises);

            await setInventory(data.product.id, formData.get('quantity'));

            alert('Produkt oprettet succesfuldt!');
            form.reset();
        } catch (error) {
            console.error("Fejl:", error);
            alert('Der opstod en fejl ved oprettelse af produktet.');
        }
    }
});

function populateDropdown(dropdown, items, textProperty = 'name') {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item[textProperty];
        dropdown.appendChild(option);
    });
}


