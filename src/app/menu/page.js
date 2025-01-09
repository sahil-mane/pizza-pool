'use client'
import { useEffect, useState } from "react"
import { SectionHeaders } from "../../components/layout/SectionHeaders";
import { MenuItem } from "../../components/menu/MenuItem";

export default function MenuPage() {

    const[categories ,setCategories] = useState([]);
    const[menuItems ,setMenuItems] = useState([]);

    useEffect(()=>{
        fetch('/api/categories')
        .then(response => response.json())
        .then(data =>setCategories(data));

        fetch('/api/menu-items')
        .then(response => response.json())
        .then(data => setMenuItems(data.data));
    },[]);

    console.log(categories)
    console.log(menuItems)
    return (
        <section className="mt-8">
            {categories?.length>0 && categories.map(c =>(
                <div key={c._id}>
                    <div className="text-center">
                        <SectionHeaders mainHeader={c.name} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 mb-8">
                        {menuItems.filter(item => item.category === c._id).map(item => (
                            <MenuItem key={item._id} {...item}/>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}

//9:36:56