import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsTrash3 } from "react-icons/bs";

export default function MenuItemPriceProps({name,addLabel,props,setProps}){    

    function addProp() {
        setProps(oldProps =>{
           return [...oldProps, { name:'', price: 0 }]
    });
    }

    function editProp(ev,index,prop) {
        const newValue = ev.target.value;
        setProps(prevSizes => {
            const newSizes = [...prevSizes];
            newSizes[index][prop] = newValue;
            return newSizes;
        });
    }

    function removeProp(indexToRemove){
        setProps(prev=> prev.filter((v,index)=> index !== indexToRemove))
    }

    return (
        <div className="bg-gray-200 p-2 rounded-md mb-2">
            <label>{name}</label>
            {props?.length > 0 && props.map((size,index)=>(
                    <div key={index} className="flex items-end gap-2">
                        <div>
                            <label>name</label>
                            <input type="text" placeholder="Size name" value={size.name} onChange={ev=> editProp(ev,index,'name')} />
                        </div>
                        <div>
                            <label>Extra price</label>
                            <input type="text" placeholder="Extra price" value={size.price} onChange={ev=> editProp(ev,index,'price')} />
                        </div>
                        <div>
                            <button type="button" onClick={()=> removeProp(index)} className="bg-white mb-2 p-3">
                            <BsTrash3 />
                            </button>
                        </div>
                    </div>
            ))} 
            <button type="button" onClick={addProp} className="bg-white flex items-center gap-2"><AiOutlinePlus />{addLabel}</button>          
          </div>
    );
}