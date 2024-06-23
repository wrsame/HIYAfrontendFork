import { createOrder, createOrderDetails } from "../api/data/postData.js";
import { getOneProduct } from "../api/data/getData.js";
import { updateInventory } from "../api/data/updateData.js"
import { getOneInventoryByProduct } from "../api/data/getData.js"

//------Create Order----

export async function newOrder(customerId, addressId, cart, subtotal) {
    if (cart.length > 0) {

        const data = {
            customer_id: customerId, 
            status: "Ordre modtaget",
            total: subtotal,
            productCount: cart.length,
            address_id: addressId,
        };
    
        try {
            const order = await createOrder(data);
            await postOrderDetails(cart, order.id);
            console.log('Order and details created successfully');
            return order
        } catch (error) {
            console.error('Error creating order:', error);
        }

    } else{
        alert("din kurv er tom")
    }
    
}

async function postOrderDetails(cart, orderId) {
    try {
        const productPromises = cart.map(item => getOneProduct(item.id));
        const products = await Promise.all(productPromises);

        const orderDetailsPromises = products.map(async (product, index) => {
            const item = cart[index];

            const data = {
                order_id: orderId,
                product_id: product.id,
                quantity: item.quantity,
                total: item.quantity * product.price
            };

            await createOrderDetails(data);

            const inventory = await getOneInventoryByProduct(product.id)
            await updateInventory(product.id, {quantity : inventory.quantity - item.quantity });
        });

        await Promise.all(orderDetailsPromises);
        console.log('Order details created successfully');
    } catch (error) {
        console.error('Error creating order details:', error);
    }
}


