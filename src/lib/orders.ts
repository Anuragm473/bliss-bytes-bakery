import { prisma } from "./prisma";
import { randomUUID } from "crypto";

type CreateOrderInput = {
  name: string;
  phone: string;
  address: string;
  area: string;
  landmark?: string;
  pincode: string;

  deliveryDate: string;
  deliveryTime: string;

  items: any;

  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalPrice: number;
};

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = randomUUID().slice(0, 4).toUpperCase();
  return `BB-${date}-${random}`;
}

export async function createOrder(data: CreateOrderInput) {
  // 1️⃣ Find existing user by phone
  let user = await prisma.user.findUnique({
    where: { phone: data.phone },
  });

  // 2️⃣ If not exists, create user
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
      },
    });
  }

  // 3️⃣ Create order linked to user
  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),

      userId: user.id,

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

      paymentMethod: "cod",
      status: "pending",
    },
  });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
  });
}

export async function getOrdersByPhone(phone: string) {
  const user = await prisma.user.findUnique({
    where: { phone },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return user?.orders || [];
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({
    where: { id },
  });
}
