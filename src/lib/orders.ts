import { prisma } from "./prisma";
import { randomUUID } from "crypto";

type CreateOrderInput = {
  name: string;
  phone: string;
  address: string;
  area: string;
  landmark?: string;
  pincode: string;

  deliveryDate: Date;
  deliveryTime: string;

  items: any;

  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalPrice: number;

  paymentMethod?: "cod"; // optional because default exists
};

function generateOrderNumber() {
  // Example: BB-20240215-8F3A
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = randomUUID().slice(0, 4).toUpperCase();
  return `BB-${date}-${random}`;
}

export async function createOrder(data: CreateOrderInput) {
  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),

      name: data.name,
      phone: data.phone,
      address: data.address,
      area: data.area,
      landmark: data.landmark,
      pincode: data.pincode,

      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,

      items: data.items,

      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      tax: data.tax,
      totalPrice: data.totalPrice,

      paymentMethod: "cod", // enforce COD
      status: "pending",    // matches schema default
    },
  });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
  });
}

export async function updateOrderStatus(
  id: string,
  status: string
) {
  return prisma.order.update({
    where: { id },
    data: {
      status,
    },
  });
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({
    where: { id },
  });
}
