import { getCustomerOrdreHistory } from "../api/data/getData.js";
import { baseUrl } from "../api/requests.js";
import { logout } from "../api/authRequests.js";

document.addEventListener("DOMContentLoaded", async () => {
    const customer = getCustomerFromSession();

    if (!customer) {
        window.location.href = '/src/html/loginAndRegistration.html';
        return;
    }

    document.querySelector(".customerName").textContent = customer.firstName;
    
    setupEventListeners();

    await loadOrderHistory(customer.id);
    showOrderHistory(); //default når man lander på siden
});

function getCustomerFromSession() {
    return JSON.parse(sessionStorage.getItem('customer-HIYA'));
}

function setupEventListeners() {
    document.getElementById("logout").addEventListener("click", handleLogout);
    document.getElementById("order-tab").addEventListener("click", (e) => {
        e.preventDefault();
        showOrderHistory();
    });
    document.getElementById("info-tab").addEventListener("click", (e) => {
        e.preventDefault();
        showUserInfo();
    });
}

function handleLogout() {
    const confirmLogout = confirm("Er du sikker på, at du vil logge ud?");
    if (confirmLogout) {
        logout();
    }
}

async function loadOrderHistory(customerId) {
    const orderHistoryContainer = document.querySelector(".order-history");

    try {
        const orders = await getCustomerOrdreHistory(customerId);
        if (orders.length > 0) {
            orders.forEach(order => orderHistoryContainer.appendChild(createOrderElement(order)));
        } else {
            orderHistoryContainer.appendChild(createNoOrdersMessage());
        }
    } catch (error) {
        console.error("Error fetching order history:", error);
        orderHistoryContainer.appendChild(createErrorMessage());
    }
}

function createOrderElement(order) {
    const orderDiv = document.createElement("div");
    orderDiv.className = "border border-gray-200 rounded-lg shadow-lg p-4 mb-4 bg-white";

    const orderHeader = createOrderHeader(order);
    const orderDetails = createOrderDetails(order);
    const orderFooter = createOrderFooter(order);

    orderDiv.appendChild(orderHeader);
    orderDiv.appendChild(orderDetails);
    orderDiv.appendChild(orderFooter);

    return orderDiv;
}

function createOrderHeader(order) {
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

    return orderHeader;
}

function createOrderDetails(order) {
    const orderDetails = document.createElement("div");
    orderDetails.className = "grid grid-cols-1 md:grid-cols-4 gap-4";

    order.order_details.forEach(detail => {
        orderDetails.appendChild(createOrderDetail(detail));
    });

    return orderDetails;
}

function createOrderDetail(detail) {
    const detailDiv = document.createElement("div");
    detailDiv.className = "border border-gray-200 rounded-lg p-2 flex flex-row items-center";

    const productImageDiv = document.createElement("div");
    const productImage = document.createElement("img");
    const primaryImage = detail.product.product_image.find(img => img.is_primary);
    productImage.src = primaryImage ? `${baseUrl}${primaryImage.imageURL}` : '/path/to/default/image.jpg';
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

    return detailDiv;
}

function createOrderFooter(order) {
    const orderFooter = document.createElement("div");
    orderFooter.className = "mt-4";

    const dateAndTotalWrapper = document.createElement("div");
    dateAndTotalWrapper.className = "flex flex-col md:flex-row justify-between items-start md:items-center";

    const orderDate = document.createElement("span");
    orderDate.className = "text-sm text-gray-500";
    orderDate.textContent = `Dato: ${new Date(order.created_at).toLocaleDateString("da-DK")}`;

    const orderTotal = document.createElement("span");
    orderTotal.className = "text-lg font-semibold text-gray-800 mt-2 md:mt-0";
    orderTotal.textContent = `Total: ${order.total} kr`;

    const orderAddress = createOrderAddress(order);

    dateAndTotalWrapper.appendChild(orderDate);
    dateAndTotalWrapper.appendChild(orderTotal);
    orderFooter.appendChild(dateAndTotalWrapper);
    orderFooter.appendChild(orderAddress);

    return orderFooter;
}

function createOrderAddress(order) {
    const orderAddress = document.createElement("div");
    orderAddress.className = "text-sm text-gray-500 mt-2 md:mt-0";
    if (order.address) {
        orderAddress.textContent = `Levering til: ${order.address.name}, ${order.address.street}, ${order.address.city}, ${order.address.region}, ${order.address.postalcode}, ${order.address.country}`;
    }
    return orderAddress;
}

function createNoOrdersMessage() {
    const noOrdersMessage = document.createElement("p");
    noOrdersMessage.className = "text-gray-600";
    noOrdersMessage.textContent = "Du har ingen ordrer endnu.";
    return noOrdersMessage;
}

function createErrorMessage() {
    const errorMessage = document.createElement("p");
    errorMessage.className = "text-red-600";
    errorMessage.textContent = "Der opstod en fejl ved hentning af din ordre historik. Prøv venligst igen senere.";
    return errorMessage;
}

function showOrderHistory() {
    document.getElementById("order-history").classList.remove("hidden");
    document.getElementById("user-info").classList.add("hidden");
    document.getElementById("order-tab").classList.add("active");
    document.getElementById("info-tab").classList.remove("active");
}

function showUserInfo() {
    document.getElementById("user-info").classList.remove("hidden");
    document.getElementById("order-history").classList.add("hidden");
    document.getElementById("info-tab").classList.add("active");
    document.getElementById("order-tab").classList.remove("active");

    const customer = getCustomerFromSession();

    if (customer) {
        const { firstName, lastName, email, phone } = customer;

        document.getElementById('first_name').value = firstName || '';
        document.getElementById('last_name').value = lastName || '';
        document.getElementById('email').value = email || '';
        document.getElementById('phone').value = phone || '';
    }
}
