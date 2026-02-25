// Create Map (Key = Product ID, Value = Product Object)
const products = new Map();

// Buttons
document.getElementById("addBtn").addEventListener("click", addProduct);
document.getElementById("searchBtn").addEventListener("click", searchProduct);
document.getElementById("deleteBtn").addEventListener("click", deleteProduct);

// Add 5 default products
products.set(101, {name:"Keyboard", price:2500});
products.set(102, {name:"Mouse", price:1200});
products.set(103, {name:"Monitor", price:28000});
products.set(104, {name:"Headphones", price:3500});
products.set(105, {name:"USB Flash", price:1500});

displayProducts();

// ADD PRODUCT
function addProduct(){

    const id = Number(document.getElementById("pid").value);
    const name = document.getElementById("pname").value;
    const price = Number(document.getElementById("pprice").value);
    const msg = document.getElementById("message");

    if(products.has(id)){
        msg.innerText = "Product ID already exists!";
        msg.style.color="red";
        return;
    }

    products.set(id,{name,price});
    msg.innerText = "Product added successfully!";
    msg.style.color="green";

    displayProducts();
}

// SEARCH PRODUCT
function searchProduct(){

    const id = Number(document.getElementById("searchId").value);
    const result = document.getElementById("searchResult");

    if(products.has(id)){
        const p = products.get(id);
        result.innerHTML = `<b>Found:</b> ${p.name} - Rs.${p.price}`;
    }
    else{
        result.innerHTML = "<span style='color:red'>Product not found</span>";
    }
}

// DELETE PRODUCT
function deleteProduct(){

    const id = Number(document.getElementById("deleteId").value);
    const msg = document.getElementById("message");

    if(products.delete(id)){
        msg.innerText="Product deleted!";
        msg.style.color="green";
    }
    else{
        msg.innerText="Product ID not found!";
        msg.style.color="red";
    }

    displayProducts();
}

// DISPLAY ALL PRODUCTS
function displayProducts(){

    const list = document.getElementById("productList");
    list.innerHTML="";

    for(let [id,product] of products){
        const li=document.createElement("li");
        li.textContent=`ID:${id} | ${product.name} | Rs.${product.price}`;
        list.appendChild(li);
    }

    document.getElementById("total").innerText=
        "Total Products: "+products.size;
}
