import { prisma } from "./prisma";

type CreateOrderInput = {
  name: string;
  phone: string;
  address: string;
  area: string;
  items: any;
  totalPrice: number;
  paymentMethod: "COD" | "ONLINE";
  deliveryDate: Date;
  deliverySlot: string;
};

export async function createOrder(data: CreateOrderInput) {
  return prisma.order.create({
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      area: data.area,
      items: data.items,
      totalPrice: data.totalPrice,
      paymentMethod: data.paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      deliveryDate: data.deliveryDate,
      deliverySlot: data.deliverySlot,
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

export async function updateOrderStatus(
  id: string,
  status: string
) {
  return prisma.order.update({
    where: { id },
    data: { orderStatus: status },
  });
}
