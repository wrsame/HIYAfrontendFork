import { fetchData } from "../requests.js";
import { inventoryByProduct } from "./endpoints.js";

const updateOperation = 'update'

//-----------Inventory--------------
export const updateInventory = (productId, data) => fetchData(updateOperation, `${inventoryByProduct}${productId}`, data)


