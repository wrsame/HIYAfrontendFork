import { deleteProduct } from "../api/data/deleteData.js";
import { getProducts } from "../api/data/getData.js";
import {baseUrl} from "../api/requests.js"


document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');
    
    try {
        const products = await getProducts();
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'flex justify-between items-center border-b border-gray-200 py-4';

            const productImage = document.createElement('img');
            const primaryImage = product.images.find(image => image.is_primary);
            productImage.src = `${baseUrl}${primaryImage.imageURL}`;
            productImage.alt = product.description;
            productImage.className = 'w-16 h-16 object-cover mr-4';

            const productInfo = document.createElement('div');
            productInfo.className = 'text-lg';
            productInfo.textContent = product.product_series.name;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'bg-red-500 text-white px-4 py-2 rounded-md hover:bg-black';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                try {
                    await deleteProduct(product.id);
                    productItem.remove();
                    alert('Product deleted successfully');
                } catch (error) {
                    console.error('Error deleting product:', error);
                    alert('Failed to delete product');
                }
            });

            const productDetails = document.createElement('div');
            productDetails.className = 'flex items-center';

            productDetails.appendChild(productImage);
            productDetails.appendChild(productInfo);

            productItem.appendChild(productDetails);
            productItem.appendChild(deleteButton);
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products');
    }
});
