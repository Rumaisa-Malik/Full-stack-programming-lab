import Image from "next/image";

export default async function ProductDetail({ params }) {
  const { id } = await params;

  const products = [
    {
      id: "1",
      title: "Phone",
      price: 500,
      description: "Smart phone with modern features",
      image: "/images/phone.jpg",
    },
    {
      id: "2",
      title: "Laptop",
      price: 1000,
      description: "High performance laptop for work and gaming",
      image: "/images/laptop.png",
    },
    {
      id: "3",
      title: "Headphones",
      price: 200,
      description: "Noise cancelling headphones",
      image: "/images/headphones.jpg",
    },
  ];

  const product = products.find((p) => p.id === id);

  if (!product) return <h1>Product not found</h1>;

  return (
    <div className="p-10 flex flex-col md:flex-row gap-10 items-center">
      <div className="bg-gray-100 p-6 rounded-xl">
        <Image
          src={product.image}
          width={400}
          height={300}
          alt={product.title}
          className="object-contain"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">
          {product.title}
        </h1>
        <p className="text-gray-400 mb-2">
          {product.description}
        </p>
        <p className="text-2xl font-semibold text-green-400">
          ${product.price}
        </p>
      </div>
    </div>
  );
}