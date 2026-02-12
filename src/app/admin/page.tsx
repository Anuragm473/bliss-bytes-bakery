"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-[#4B2E83] mb-10">
        Admin Dashboard
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow mb-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {order.name}
                </h2>
                <p>{order.phone}</p>
                <p>{order.area}</p>
                <p className="font-bold mt-2">
                  ₹{order.totalPrice}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-semibold">
                  Status: {order.orderStatus}
                </span>

                <div className="flex gap-2 flex-wrap">
                  {[
                    "PLACED",
                    "BAKING",
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateStatus(order.id, status)
                      }
                      className="px-3 py-1 bg-[#4B2E83] text-white rounded text-sm"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
