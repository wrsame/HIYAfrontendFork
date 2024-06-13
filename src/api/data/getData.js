import { fetchData } from "../requests.js";
import { inventory, inventoryByProduct, customersEndpoint, limitedProductsEndpoint, latestCollectionsEndpoint,
    collectionEndpoint, materialsEndpoint, productSeriesEndpoint, productsEndpoint, productsByProductSeries, ordersEndpoint } from "./endpoints.js";


const readOperation = 'read'

//------Get collections---------
export const getCollections = () => fetchData(readOperation, collectionEndpoint);
export const getLatestCollections = (count) => fetchData(readOperation, `${latestCollectionsEndpoint}${count}`);


//------Get Materials---------
export const getMaterials = () => fetchData(readOperation, materialsEndpoint);


//------Get ProductSeries---------
export const getProductSeries = () => fetchData(readOperation, productSeriesEndpoint);


//------Get Product------------
export const getProducts = () => fetchData(readOperation, productsEndpoint);
export const getOneProduct = (id) => fetchData(readOperation, `${productsEndpoint}/${id}`);
export const getProductsByProductSeries = (id) => fetchData(readOperation, `${productsByProductSeries}${id}`);
export const getLimitedProducts = (count) => fetchData(readOperation, `${limitedProductsEndpoint}${count}`);


//-------Get Inventory ------------

export const getOneInventoryByProduct = (id) => fetchData(readOperation, `${inventoryByProduct}${id}`);

//-------Get Customer ------------
export const getOneCustomer = (id) => fetchData(readOperation, `${customersEndpoint}/${id}`);
export const getCustomerOrdreHistory = (id) => fetchData(readOperation, `${customersEndpoint}/${id}${ordersEndpoint}`);





