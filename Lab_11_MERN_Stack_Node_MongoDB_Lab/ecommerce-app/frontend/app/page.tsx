async function getProducts() {

  const res = await fetch("http://localhost:5000/products", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {

  const products = await getProducts();

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-5">
        Ecommerce Products
      </h1>

      <div className="grid grid-cols-3 gap-5">

        {products.map((product: any) => (

          <div
            key={product._id}
            className="border p-5 rounded-lg shadow-lg"
          >

            <h2 className="text-xl font-bold">
              {product.name}
            </h2>

            <p>Price: Rs. {product.price}</p>

            <p>Category: {product.category}</p>

          </div>
        ))}

      </div>

    </div>
  );
}