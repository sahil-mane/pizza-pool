"use client";
import { useContext, useEffect, useState } from "react";
import UserTabs from "../../components/layout/UserTabs";
import useProfile from "../../components/UseProfile";
import Link from "next/link";
import { CartContext } from "../../components/AppContext";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
    const { setViewMessagefalse } = useContext(CartContext);
  const { data: profiledata } = useProfile();

  function dbTimeForHuman(str) {
    return str.replace("T", " ").split(".")[0];
  }

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data.reverse());
    setLoadingOrders(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  console.log("order==>>", orders);

  return (
    <section className="max-w-2xl mt-8 mx-auto">
      <UserTabs isAdmin={profiledata} />
      {loadingOrders && <div>Loading orders...</div>}
      <div className="mt-8">
        {orders?.length > 0 &&
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div
                    className={
                      order.paid
                        ? "bg-green-500 p-2 rounded-md text-white w-24 text-center"
                        : "bg-red-500 p-2 rounded-md text-white w-24 text-center"
                    }
                  >
                    {order.paid ? "Paid" : "Not paid"}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="grow">{order.userEmail}</div>
                    <div className="text-gray-500 text-sm">
                      {/* {order.createdAt} */}
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end text-right flex gap-2 items-center whitespace-nowrap">
                <Link href={`/orders/${order._id}`} onClick={()=>setViewMessagefalse("true")}  className="button">
                  Show order
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
