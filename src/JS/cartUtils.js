export function updateCartQuantityBadge(){
    console.log("ramt");

    const cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];

    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartQuantityBadge = document.getElementById('cart-quantity-badge');
    if (cartQuantityBadge) {
        cartQuantityBadge.innerHTML = totalQuantity;
        console.log(cartQuantityBadge);
    }

}