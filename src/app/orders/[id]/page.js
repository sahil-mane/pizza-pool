"use client";
import { useContext, useEffect, useState } from "react";
import { SectionHeaders } from "../../../components/layout/SectionHeaders";
import { CartContext, cartProductPrice } from "../../../components/AppContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Trash from "../../../components/icons/Trash";


export default function OrderPage() {
  const { clearCart, removeCartProduct, setViewMessagefalse,viewMessagefalse } = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [viewMessage, setViewMessage] = useState(false);

  const router = useRouter();

  let { id } = useParams();

  useEffect(() => {
    if(viewMessagefalse == "true")
    {
      setViewMessage(false);// Reset viewMessage whenever id changes
    }
    else{
      setViewMessage(true); // Reset viewMessage whenever id changes
    }
    const timer = setTimeout(() => {
      setViewMessage(false);
    }, 6000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [id]);

  console.log("viewMessagefalse",viewMessagefalse)
  // useEffect(() => {
  //  if (viewMessagefalse === false) {
  //   setViewMessage(false);
  // }   
  //   setViewMessage(true);
  //   const timer = setTimeout(() => {
  //     setViewMessage(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  
  // }, [id]);

  useEffect(() => {
    if (window.location.href.includes("clear-cart-1")) {
      clearCart();
    }

    if (id) {
      if (id.includes("clear-cart-1")) {
        id = id.replace("clear-cart-1", "");
      }
      setLoadingOrder(true);
      fetch("/api/orders?_id=" + id)
        .then((res) => res.json())
        .then((orders) => {
          setOrder(orders);
          setLoadingOrder(false);

          // Initialize address fields
          setPhone(orders.phone || "");
          setStreetAddress(orders.streetAddress || "");
          setPostalCode(orders.pinCode || "");
          setCity(orders.city || "");
          setCountry(orders.country || "");
        });
    }
  }, [id]);

  if (loadingOrder) return <div>Loading Order...</div>;

  const Subtotal = order?.cartProducts.reduce(
    (acc, product) => acc + cartProductPrice(product),
    0
  );
  const Delivery = 100;
  const Total = Subtotal + Delivery;

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader={"your orders"} />
      </div>
      {viewMessage && (
        <div>
          <p>Thanks for your Order</p>
          <p>We will call you when your order is on the way.</p>
        </div>
      )}

      {order && (
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            {order.cartProducts.length > 0 ? (
              order.cartProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 mb-2 border-b py-2"
                >
                  <div className="w-24">
                    <Image
                      width={240}
                      height={240}
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="grow">
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.size && (
                      <div className="text-sm text-gray-700">
                        Size: <span>{product.size.name}</span>
                      </div>
                    )}
                    {product.extras?.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {product.extras.map((extra) => (
                          <div key={extra._id}>
                            {extra.name} ₹{extra.price}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-semibold">
                    ₹{cartProductPrice(product)}
                  </div>
                  {/* <div className="ml-2">
                    <button
                      type="button"
                      onClick={() => removeCartProduct(index)}
                      className="p-2"
                    >
                      <Trash />
                    </button>
                  </div> */}
                </div>
              ))
            ) : (
              <div>No Products in your shopping cart</div>
            )}
            <div className="py-4 text-right pr-16">
              <div>
                <span className="text-gray-500"> Subtotal:</span>
                <span className="text-lg font-semibold"> ₹{Subtotal} /-</span>
              </div>
              <div>
                <span className="text-gray-500"> Delivery:</span>
                <span className="text-lg font-semibold"> ₹{Delivery} /-</span>
              </div>
              <div>
                <span className="text-gray-500"> Total:</span>
                <span className="text-lg font-semibold"> ₹{Total} /-</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg h-fit">
            <h2>Checkout</h2>
            <form>
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Phone number"
                className="text-left"
                value={phone}
                disabled
                onChange={(e) => setPhone(e.target.value)}
              />
              <label>Street address</label>
              <input
                type="text"
                placeholder="Street address"
                className="text-left"
                value={streetAddress}
                disabled
                onChange={(e) => setStreetAddress(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Postal Code</label>
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="text-left"
                    value={postalCode}
                    disabled
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div>
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    className="text-left"
                    value={city}
                    disabled
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <label>Country</label>
              <input
                type="text"
                placeholder="Country"
                className="text-left"
                value={country}
                disabled
                onChange={(e) => setCountry(e.target.value)}
              />
            </form>
          </div>
        </div>
      )}
      {!viewMessage && <button onClick={()=>router.push("/")} >Go Home</button>}
    </section>
  );
}
