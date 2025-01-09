"use client";
import toast from "react-hot-toast";

import useProfile from "../../components/UseProfile";
import {useState,useEffect } from "react";
import Image from "next/image";
import UserTabs from "../../components/layout/UserTabs";
import Link from "next/link";
import {Left} from "../../components/icons/Left"
import { Right } from "../../components/icons/Right";



export default function MenuItemsPage() {

  const [menuItems,setMenuItems] = useState();
  const {loading, data} = useProfile();
  
  const fetchMenuItems = () =>{
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {              
        setMenuItems(menuItems);
      });
    })
  }

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return "loading user info....";
  }

  if (!data) {
    return "not an Admin";
  }
   
  return (
   <section className="mt-8 max-w-md mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8 ">
        <Link
        className="button flex"
        href={'/menu-items/new'}>
          Create new Menu item          
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-2">
        {menuItems.data?.length > 0 && menuItems.data.map(item => (
          <Link href={'/menu-items/edit/'+item._id} className="bg-gray-200 rounded-lg p-4" key={item._id}>
            <div className="relative">
              <Image
              className="rounded-md"
              src={item.image} width={100} height={100} alt="" />
            </div>
            <div className="text-center">
            {item.name}
            </div>
          </Link>
        ))}
        </div>
      </div>
   </section>
  );
}
