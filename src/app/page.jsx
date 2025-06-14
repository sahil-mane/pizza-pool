"use client"
import { Hero } from "../components/layout/Hero";
import { HomeMenu } from "../components/layout/HomeMenu";
import { SectionHeaders } from "../components/layout/SectionHeaders";

export default function Home() {

  return (
    <>      
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Our story'}
          mainHeader={'About us'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Odio reiciendis fugiat velit ipsam doloremque repellendus
            minus magnam vero numquam, saepe, quaerat dolores molestias
            consectetur corporis adipisci natus. Aliquid, earum ut!
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Odio reiciendis fugiat velit ipsam doloremque repellendus
            minus magnam vero numquam, 
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Odio reiciendis fugiat velit ipsam
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
        subHeader={'Don\'t hesitate'}
        mainHeader={'Contact us'}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" 
          href="tel:+919000050000">
            +919 000 050 000
          </a>
        </div>        
      </section>      
    </>
  );
}
