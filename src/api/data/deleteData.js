import { productsEndpoint } from "./endpoints.js";
import { fetchData } from "../requests.js";

const deleteOperation = 'delete'

//------delete Product------------
export const deleteProduct = (id) => fetchData(deleteOperation, `${productsEndpoint}/${id}`);
