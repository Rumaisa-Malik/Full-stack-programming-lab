import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: "1",
    title: "Phone",
    price: 500,
    image: "/images/phone.jpg",
  },
  {
    id: "2",
    title: "Laptop",
    price: 1000,
    image: "/images/laptop.png",
  },
  {
    id: "3",
    title: "Headphones",
    price: 200,
    image: "/images/headphones.jpg",
  },
];

export default function Products() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Product Catalog
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition duration-300"
          >
            <div className="bg-gray-100 flex items-center justify-center h-52">
              <Image
                src={p.image}
                width={300}
                height={200}
                alt={p.title}
                className="object-contain h-full w-full p-4"
              />
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="text-gray-400 mb-2">${p.price}</p>

              <Link
                href={`/products/${p.id}`}
                className="text-blue-400 hover:text-blue-300 transition"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}