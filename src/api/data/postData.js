import { login, register } from "../authRequests.js";
import { fetchData, baseApi, createData } from "../requests.js";
import { productSeriesEndpoint, productsEndpoint, uploadImagesEndpoint, saveImageUrlsEndpoint,
addProductToCollectionEndpoint, inventory, collectionEndpoint, materialsEndpoint, ordersEndpoint,
orderDetailsEndpoint, addressEndpoint, registerEndpoint, loginEndpoint } from "./endpoints.js";

//------Endpoints----

const createOperation = 'create'

//-----------ProductSeries--------------
export const createProductSeries = (productName) => fetchData(createOperation, productSeriesEndpoint, { name: productName });

//-----------Product--------------
export const createProduct = (productData) => fetchData(createOperation, productsEndpoint, productData);

//-----------Images--------------
export const uploadImages = async (formData) => {
    console.log(`${baseApi}${uploadImagesEndpoint}`);
    console.log(formData);
    return fetch(`${baseApi}${uploadImagesEndpoint}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            console.log("HAAAAAAAAAAA");
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => data.uploadedUrls)
    .catch(error => {
        throw error;
    });
};

//-----------saveImageUrls--------------
export const saveImageUrls = (productId, images) => {
    
    const promises = images.map(image => fetchData(createOperation, saveImageUrlsEndpoint, {
        product_id: productId,
        imageURL: image.url,
        is_primary: image.isPrimary
    }));
    return Promise.all(promises);
};

//-----------ProductCollection--------------
export const addProductToCollection = (productId, collectionId) => fetchData(createOperation, addProductToCollectionEndpoint, { product_id: productId, collection_id: collectionId });

//-----------Inventory-------------
export const setInventory = (productId, quantity) => fetchData(createOperation, inventory, { product_id: productId, quantity });

//-----------collection--------------
export const createCollection = (name) => fetchData(createOperation, collectionEndpoint, name)

//-----------material--------------
export const createMaterial = (name) => fetchData(createOperation, materialsEndpoint, name)

//-----------Order--------------
export const createOrder = (orderData) => fetchData(createOperation, ordersEndpoint, orderData)

//-----------Order details--------------
export const createOrderDetails = (orderDetailsData) => fetchData(createOperation, orderDetailsEndpoint, orderDetailsData)

//-----------Address--------------
export const createAddress = (data) => fetchData(createOperation, addressEndpoint, data)

//-----------Register--------------
export const registerUser = (userData) => register(registerEndpoint, userData);

//-----------Login--------------
export const loginUser = (credentials) => login(loginEndpoint, credentials);



