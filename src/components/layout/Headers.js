"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../AppContext";
import ShoppingCart from '../icons/ShoppingCart.js'
import { usePathname, useRouter } from "next/navigation";

export const Headers = () => {
  // const session = useSession();
  const { data: session, status } = useSession();
  console.log(session, status);
  // console.log("session====>>>>",session);
  // const status = session.status;
  // const userData = session.data?.user;
  const userData = session?.user;
  let username = userData?.name || userData?.email || "";
  if(username && username.includes(' '))
  {
    username = username.split(" ")[0]
  }
  const {cartProducts} = useContext(CartContext);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () =>{
   signOut({ callbackUrl: "/" });
  }
  
  console.log("---->>>",pathname)

  return (
    <header className="flex items-center justify-between">
      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link href="/" className="text-primary font-semibold text-2xl uppercase">
          Slice Haven
        </Link>
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link> 
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <nav className="flex justify-center items-center gap-4 text-gray-500 font-semibold">
        {status === "authenticated" && (
          <>
          <Link href={'/profile'} className="whitespace-nowrap">Namaste, {username}</Link>
          <button
            href=""
            className="bg-primary text-white rounded-full px-8 py-2"
            onClick={()=> handleLogout()}
          >
            Logout
          </button>
          </>
        )}
        {status === "unauthenticated" && (
          <>
            <Link href="/login">Login</Link>
            <Link
              href="/register"
              className="bg-primary text-white rounded-full px-8 py-2"
            >
              Register
            </Link>
          </>
        )}
        <Link href={'/cart'} className="relative">
        <ShoppingCart />
        <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">{cartProducts?.length}</span>        
        </Link>
      </nav>
    </header>
    // 10:32:55
  );
};
