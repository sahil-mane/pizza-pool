import Image from "next/image";
import { useState } from "react";
import MenuItemPriceProps from "../layout/MenuItemPriceProp";
import { BsTrash3 } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

export default function MenuItemForm({
  id,
  name,
  setName,
  description,
  setDescription,
  basePrice,
  setBasePrice,
  handleImageChange,
  imagePreview,
  handleSubmitMenu,

}) {
  const [sizes, setSizes] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState([]);

  function addSize() {
    setSizes((oldSizes) => [...oldSizes, { name: "", price: 0 }]);
  }
  function addextraIngred() {
    setExtraIngredientPrices((oldIngred) => [...oldIngred, { name: "", price: 0 }]);
  }

  function editSize(ev, index, prop) {
    const newValue = ev.target.value;
    setSizes((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function editIngred(ev, index, prop) {
    const newValue = ev.target.value;
    setExtraIngredientPrices((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeSize(indexToRemove) {
    setSizes((prev) => prev.filter((_, index) => index !== indexToRemove));
  }
  function removeIngred(indexToRemove) {
    setExtraIngredientPrices((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <form onSubmit={handleSubmitMenu} className="mt-8 max-w-md mx-auto">
      <div className="flex gap-3">
        <div>
          {/* Image Preview */}
          {imagePreview && (
            <div className=" p-2 m-2 rounded-lg">
              <Image
                src={imagePreview}
                width={100}
                height={100}
                alt="Selected preview"
                className="w-24 h-24 object-cover rounded-md"
              />
            </div>
          )}
          <div className="w-full mb-2 rounded-md flex justify-center p-2 mx-auto border border-gray-300 bg-white">
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-gray-500 px-4"
            >
              {id ? "Edit" : "Select image"}
            </label>
            <input
              type="file"
              name="image"
              className="hidden"
              id="fileInput"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="grow">
          <label>Item name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />

          <label>Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          <label>Base price</label>
          <input
            type="text"
            name="price"
            value={basePrice}
            onChange={(ev) => setBasePrice(ev.target.value)}
          />
          <div className="bg-gray-200 p-2 rounded-md mb-2">
            <label>Sizes</label>
            {sizes?.length > 0 &&
              sizes.map((size, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div>
                    <label>name</label>
                    <input
                      type="text"
                      placeholder="Size name"
                      value={size.name}
                      onChange={(ev) => editSize(ev, index, "name")}
                    />
                  </div>
                  <div>
                    <label>Extra price</label>
                    <input
                      type="text"
                      placeholder="Extra price"
                      value={size.price}
                      onChange={(ev) => editSize(ev, index, "price")}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="bg-white mb-2 p-3"
                    >
                      <BsTrash3 />
                    </button>
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={addSize}
              className="bg-white flex items-center gap-2"
            >
              <AiOutlinePlus />
              add items
            </button>
          </div>
          <div className="bg-gray-200 p-2 rounded-md mb-2">
            <label>Extra ingredients</label>
            {extraIngredientPrices?.length > 0 &&
              extraIngredientPrices.map((size, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div>
                    <label>ingredients name</label>
                    <input
                      type="text"
                      placeholder="ingredient name"
                      value={size.name}
                      onChange={(ev) => editIngred(ev, index, "name")}
                    />
                  </div>
                  <div>
                    <label>Extra price</label>
                    <input
                      type="text"
                      placeholder="Extra price"
                      value={size.price}
                      onChange={(ev) => editIngred(ev, index, "price")}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeIngred(index)}
                      className="bg-white mb-2 p-3"
                    >
                      <BsTrash3 />
                    </button>
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={addextraIngred}
              className="bg-white flex items-center gap-2"
            >
              <AiOutlinePlus />
              add ingredients
            </button>
          </div>
          <button type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}
