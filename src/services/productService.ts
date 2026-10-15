import { products as initialProducts } from "@/data/mock";
import type { Product } from "@/types";

let mockProductsData: Product[] = [...initialProducts];

export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...mockProductsData]), 100));
}
