export type ProductSizes = {
  [key: string]: number;
};

export type CartItem = {
  productId: string;
  title: string;
  size: string;
  flavor: string;
  price: number;
  quantity: number;
};
