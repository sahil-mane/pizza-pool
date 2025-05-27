import Image from 'next/image'
import React from 'react'
import Pizza from '../../../public/pizza.png'
import { Right } from '../icons/Right'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'


export const Hero = () => {   
    const {data,status} = useSession();
    const router = useRouter();
    console.log({data,status})

    const handleNavigate = () => {
       return status == 'authenticated' ? router.push("/menu") : router.push("/login");       
    }

  return (
    <section className="hero">
        <div className="py-16">
            <h1 className="text-4xl font-semibold">
                Everything <br/> is better<br /> with a&nbsp; 
                <span className="text-primary">
                Pizza
                </span> 
            </h1>
            <p className="my-6 text-gray-500 text-sm">Pizza is the missing piece that makes every day complete, a simple yet delicious joy in life </p>
            <div className="flex gap-4 text-sm">
                <button className="bg-primary uppercase flex items-center justify-center gap-2 text-white px-4 py-2 rounded-full" onClick={()=>handleNavigate()}>
                    Order now 
                    <Right colors={'white'} />
                </button>
                <button className="flex items-center justify-center border-0 gap-2 py-2 text-gray-600 font-semibold">
                    Learn more
                    <Right colors={'black'} />
                </button>
            </div>
        </div>
        <div className="relative lg:h-[400px]">
            <Image src={Pizza} layout={'fill'} objectFit={'contain'} alt={'pizza'} />
        </div>
    </section>
  )
}
