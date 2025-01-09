"use client";
import React, { useContext, useEffect, useState } from "react";
import { SectionHeaders } from "../../components/layout/SectionHeaders";
import { CartContext, cartProductPrice } from "../../components/AppContext.js";
import Image from "next/image";
import Trash from "../../components/icons/Trash";
import useProfile from "../../components/UseProfile.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentPopUp, setPaymentPopUp] = useState(false);
  const [paidStatus, setPaidStatus] = useState(false);
  const router = useRouter();

  const { profileData } = useProfile();
  console.log(profileData);

  useEffect(() => {
    if (profileData) {
      setPhone(profileData.phone);
      setStreetAddress(profileData.streetAddress);
      setCity(profileData.city);
      setPostalCode(profileData.postalCode);
      setCountry(profileData.country);
    }
  }, [profileData]);

  const Delivery = 100;
  let Subtotal = 0;
  for (const p of cartProducts) {
    Subtotal += cartProductPrice(p);
  }

  const total = Subtotal + Delivery;

  function handlePayFordelivery(e) {
    e.preventDefault();
    if (paidStatus == false) {
      return toast.error("please check the checkbox for payment");
    } else {
      const paymentPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone:phone,
            streetAddress:streetAddress,
            city:city,
            postalCode:postalCode,
            country:country,
            cartProducts:cartProducts,
            paid: paidStatus,
          }),
        });
        if (response.ok && paidStatus) {
          resolve();
          const responnnnse = await response.json();

          console.log(`response`, responnnnse);
          setPaymentPopUp(false);
          router.push("/orders/" + responnnnse._id + "clear-cart-1");
        } else {
          reject();
        }
      });

      toast.promise(paymentPromise, {
        loading: "processing payment...",
        success: "order confirmed",
        error: paidStatus ? "failed to order" : "Payment Canceled",
      });
    }
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          {cartProducts?.length === 0 && (
            <div>No Products in your shopping cart</div>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
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
                <div className="ml-2">
                  <button
                    type="button"
                    onClick={() => removeCartProduct(index)}
                    className="p-2"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))}
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
              <span className="text-lg font-semibold"> ₹{total} /-</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 h-fit p-4 rounded-lg">
          <h2>Checkout</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPaymentPopUp(true);
            }}
          >
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Phone number"
              className="text-left"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label>Street address</label>
            <input
              type="text"
              placeholder="Street address"
              className="text-left"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>postal code</label>
                <input
                  type="text"
                  placeholder="Postal code"
                  className="text-left"
                  value={postalCode}
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
              onChange={(e) => setCountry(e.target.value)}
            />
            <button type="submit">Pay ₹{total}</button>
          </form>
        </div>
      </div>
      {paymentPopUp && (
        <section className="fixed inset-0 h-full w-full flex items-center justify-center bg-black/80">
          {/* {<div onClick={setPaymentPopUp(false)}>hii</div>} */}
          <div className="text-white max-w-md p-4 bg-white rounded-lg flex flex-col gap-2 ">
            <div className="text-center">
              <label>
                Confirm To proceed Please Check the checkBox For confirm Payment
              </label>
            </div>
            <div className="flex justify-center gap-2">
              <input
                type="checkbox"
                onClick={(e) => {
                  setPaidStatus(e.target.checked);
                }}
                name="paid"
              />
              <label className="text-xl">Paid</label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-primary rounded-full  text-white"
                 onClick={handlePayFordelivery}
              >
                yes,proceed
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setPaymentPopUp(false);
                }}
                className="rounded-full"
              >
                cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
//11:12:00
