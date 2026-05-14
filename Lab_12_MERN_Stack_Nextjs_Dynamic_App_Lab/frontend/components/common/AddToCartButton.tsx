"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/lib/types";

export const AddToCartButton = ({
  product,
  className,
  label = "Add to Cart",
}: {
  product: Product;
  className?: string;
  label?: string;
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button type="button" onClick={onAdd} className={className}>
      {added ? "Added" : label}
    </button>
  );
};
