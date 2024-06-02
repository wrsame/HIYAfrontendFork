import { fetchData } from "../requests.js";

const collectionEndpoint = "/collections"
const materialsEndpoint = "/materials"
const productSeriesEndpoint = "/productSeries"
const productsEndpoint = "/products"
const productsByProductSeries = "/products/bySeries/"

const readOperation = 'read'

//------Get collections---------
export const getCollections = () => fetchData(readOperation, collectionEndpoint);


//------Get Materials---------
export const getMaterials = () => fetchData(readOperation, materialsEndpoint);


//------Get ProductSeries---------
export const getProductSeries = () => fetchData(readOperation, productSeriesEndpoint);


//------Get Product------------
export const getProducts = () => fetchData(readOperation, productsEndpoint);

export const getOneProduct = (id) => fetchData(readOperation, `${productsEndpoint}/${id}`);

export const getProductsByProductSeries = (id) => fetchData(readOperation, `${productsByProductSeries}${id}`);






