import { getCustomerOrdreHistory } from "../api/data/getData.js";
import {baseUrl} from "../api/requests.js"

document.addEventListener("DOMContentLoaded", async () => {
    const customerName = document.querySelector(".customerName");
    const orderHistoryContainer = document.querySelector(".order-history");
    const orderTab = document.getElementById("order-tab");
    const infoTab = document.getElementById("info-tab");
    const orderHistoryContent = document.getElementById("order-history");
    const userInfoContent = document.getElementById("user-info");

    async function loadOrderHistory() {
        try {
            const orders = await getCustomerOrdreHistory(1); //TEST IS
           
            const customer = { name: "BASM JAWA" }; //NAVN
            customerName.textContent = customer.name;

            if (orders.length > 0) {
                orders.forEach(order => {
                    const orderDiv = document.createElement("div");
                    orderDiv.className = "border border-gray-200 rounded-lg shadow-lg p-4 mb-4 bg-white";
            
                    const orderHeader = document.createElement("div");
                    orderHeader.className = "flex justify-between items-center mb-4";
            
                    const orderId = document.createElement("h3");
                    orderId.className = "text-lg font-semibold text-gray-800";
                    orderId.textContent = `Ordre ID: ${order.id}`;
            
                    const orderStatus = document.createElement("span");
                    orderStatus.className = "text-sm font-semibold text-green-600";
                    orderStatus.textContent = order.status;
            
                    orderHeader.appendChild(orderId);
                    orderHeader.appendChild(orderStatus);
                    orderDiv.appendChild(orderHeader);
            
                    const orderDetails = document.createElement("div");
                    orderDetails.className = "grid grid-cols-1 md:grid-cols-4 gap-4";
            
                    order.order_details.forEach(detail => {
                        const detailDiv = document.createElement("div");
                        detailDiv.className = "border border-gray-200 rounded-lg p-2 flex flex-row items-center";
                    
                        const productImageDiv = document.createElement("div");
                        const productImage = document.createElement("img");
                        const primaryImage = detail.product.product_image.find(img => img.is_primary);
                        productImage.src = primaryImage ? `${baseUrl}${primaryImage.imageURL}` : '/path/to/default/image.jpg'; // Replace with a default image if no primary image is found
                        productImage.alt = detail.product.description;
                        productImage.className = "h-16 w-16 object-cover";
                        productImageDiv.appendChild(productImage);
                    
                        const productInfoDiv = document.createElement("div");
                        productInfoDiv.className = "ml-4 text-xs";
                    
                        const productDescription = document.createElement("p");
                        productDescription.className = "text-gray-600";
                        productDescription.textContent = detail.product.description;
                    
                        const productQuantity = document.createElement("p");
                        productQuantity.className = "text-gray-600";
                        productQuantity.textContent = `Antal: ${detail.quantity}`;
                    
                        const productTotal = document.createElement("p");
                        productTotal.className = "text-gray-600";
                        productTotal.textContent = `Total: ${detail.total} kr`;
                    
                        productInfoDiv.appendChild(productDescription);
                        productInfoDiv.appendChild(productQuantity);
                        productInfoDiv.appendChild(productTotal);
                    
                        detailDiv.appendChild(productImageDiv);
                        detailDiv.appendChild(productInfoDiv);
                    
                        orderDetails.appendChild(detailDiv);
                    });
            
                    orderDiv.appendChild(orderDetails);
            
                    const orderFooter = document.createElement("div");
                    orderFooter.className = "mt-4";
            
                    const dateAndTotalWrapper = document.createElement("div")
                    dateAndTotalWrapper.className = "flex flex-col md:flex-row justify-between items-start md:items-center "
                    
                    const orderDate = document.createElement("span");
                    orderDate.className = "text-sm text-gray-500";
                    orderDate.textContent = `Dato: ${new Date(order.created_at).toLocaleDateString("da-DK")}`;
            
                    const orderTotal = document.createElement("span");
                    orderTotal.className = "text-lg font-semibold text-gray-800 mt-2 md:mt-0";
                    orderTotal.textContent = `Total: ${order.total} kr`;
            
                    const orderAddress = document.createElement("div");
                    orderAddress.className = "text-sm text-gray-500 mt-2 md:mt-0";
                    if (order.address) {
                        orderAddress.textContent = `Levering til: ${order.address.name}, ${order.address.street}, ${order.address.city}, ${order.address.region}, ${order.address.postalcode}, ${order.address.country}`;
                    }
            
                    dateAndTotalWrapper.appendChild(orderDate);
                    dateAndTotalWrapper.appendChild(orderTotal);
                    orderFooter.appendChild(dateAndTotalWrapper);
                    orderFooter.appendChild(orderAddress);
            
                    orderDiv.appendChild(orderFooter);
            
                    orderHistoryContainer.appendChild(orderDiv);
                });
            } else {
                const noOrdersMessage = document.createElement("p");
                noOrdersMessage.className = "text-gray-600";
                noOrdersMessage.textContent = "Du har ingen ordrer endnu.";
                orderHistoryContainer.appendChild(noOrdersMessage);
            }
        } catch (error) {
            console.error("Error fetching order history:", error);
            const errorMessage = document.createElement("p");
            errorMessage.className = "text-red-600";
            errorMessage.textContent = "Der opstod en fejl ved hentning af din ordre historik. Prøv venligst igen senere.";
            orderHistoryContainer.appendChild(errorMessage);
        }
    }

    // Function to show the order history and hide user info
    function showOrderHistory() {
        orderHistoryContent.classList.remove("hidden");
        userInfoContent.classList.add("hidden");
        orderTab.classList.add("active");
        infoTab.classList.remove("active");
    }

    // Function to show the user info and hide order history
    function showUserInfo() {
        userInfoContent.classList.remove("hidden");
        orderHistoryContent.classList.add("hidden");
        infoTab.classList.add("active");
        orderTab.classList.remove("active");
    }

    // Event listeners for tab switching
    orderTab.addEventListener("click", (e) => {
        e.preventDefault();
        showOrderHistory();
    });

    infoTab.addEventListener("click", (e) => {
        e.preventDefault();
        showUserInfo();
    });

    // Initially load the order history
    loadOrderHistory();
    showOrderHistory(); // Show order history by default
});







