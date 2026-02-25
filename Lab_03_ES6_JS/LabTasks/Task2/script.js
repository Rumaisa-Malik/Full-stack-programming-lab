let cart = [];

function addToCart(...items) {

cart.push(...items);

let updatedCart = [...cart];

let [firstItem, ...remainingItems] = updatedCart;

document.getElementById("total").textContent = updatedCart.length;

document.getElementById("first").textContent = firstItem || "None";

document.getElementById("cart").textContent = updatedCart.join(", ");

}
