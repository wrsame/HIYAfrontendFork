import { fetchData, baseApi } from "../requests.js";

//------Endpoints----
const productSeriesEndpoint = '/productSeries';
const productsEndpoint = '/products';
const uploadImagesEndpoint = '/productImages/upload';
const saveImageUrlsEndpoint = '/productImages';
const addProductToCollectionEndpoint = '/PC';
const setInventoryEndpoint = '/inventory';
const collection = '/collections';
const material = '/materials';

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


//-----------Inventory--------------
export const setInventory = (productId, quantity) => fetchData(createOperation, setInventoryEndpoint, { product_id: productId, quantity });


//-----------collection--------------
export const createCollection = (name) => fetchData(createOperation, collection, name)

//-----------material--------------
export const createMaterial = (name) => fetchData(createOperation, material, name)