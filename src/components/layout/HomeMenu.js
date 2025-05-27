'use client';
import React, { useEffect, useState } from "react";
import sallad1 from "../../../public/sallad1.png";
import Image from "next/image";
import { MenuItem } from "../../components/menu/MenuItem";
import { SectionHeaders } from "../layout/SectionHeaders";

export const HomeMenu = () => {

  const [bestSeller,setBestSeller] = useState([]);

  useEffect(()=>{
    fetch("/api/menu-items")
    .then(response => response.json())
    .then(data => setBestSeller(data.data) )
  },[]);  

  return (
    <section>
      <div className="absolute left-0 right-0 w-full justify-start ">
        <div className="-z-10 -top-[70px] absolute left-0 text-left">
          <Image 
          src={sallad1} 
          width={180}
          height={189}         
          alt="sallad"         
          />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image
            src={sallad1}
            width={180}
            height={195}            
            alt="sallad"
            className="flip"            
          />
        </div>
      </div>
      <div className="text-center mb-4">
       <SectionHeaders
       subHeader={'Check out'}
       mainHeader={'Our Best Sellers'} 
       />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {
          bestSeller?.slice(-3).map((item, index) => (
            <MenuItem {...item} />

          ))
        }                
      </div>
    </section>
  );
  //1:00:01
};
