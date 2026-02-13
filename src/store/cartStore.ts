"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  title: string;
  image:string;
  size: string;
  flavor: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  increaseQuantity: (index: number) => void;
  decreaseQuantity: (index: number) => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),

      clearCart: () => set({ items: [] }),

      increaseQuantity: (index) =>
        set((state) => {
          const updated = [...state.items];
          updated[index].quantity += 1;
          return { items: updated };
        }),

      decreaseQuantity: (index) =>
        set((state) => {
          const updated = [...state.items];
          if (updated[index].quantity > 1) {
            updated[index].quantity -= 1;
          }
          return { items: updated };
        }),

      getTotal: () =>
        get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "bliss-bites-cart",
    }
  )
);
