"use client";
import { useEffect, useState } from "react";
import useProfile from "../../../components/UseProfile";
import UserTabs from "../../../components/layout/UserTabs";
import toast from "react-hot-toast";
import Link from "next/link";
import { Left } from "../../../components/icons/Left";
import { redirect } from "next/navigation";
import { BsTrash3 } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import Image from "next/image";

export default function NewMenuItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [redirectToUrl, setRedirectToUrl] = useState(false);

  const { loading, data } = useProfile();

  const fetchCategory = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  function addSize() {
    setSizes((oldSizes) => [...oldSizes, { name: "", price: 0 }]);
  }
  function addextraIngred() {
    setExtraIngredientPrices((oldIngred) => [
      ...oldIngred,
      { name: "", price: 0 },
    ]);
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
    setExtraIngredientPrices((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  const handleSubmitMenu = async (ev) => {
    ev.preventDefault();
    const menuData = new FormData();
    menuData.append("name", name);
    menuData.append("description", description);
    menuData.append("basePrice", basePrice);
    menuData.append("category", category);
    menuData.append("image", image);
    // menuData.append("sizes",sizes);
    // menuData.append("extraIngredientPrices", extraIngredientPrices);
    menuData.append("sizes", JSON.stringify(sizes));
    menuData.append(
      "extraIngredientPrices",
      JSON.stringify(extraIngredientPrices)
    );

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: menuData,
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item",
      success: "Saved!",
      error: "Error",
    });

    setRedirectToUrl(true);
  };

  if (redirectToUrl) {
    return redirect("/menu-items");
  }

  const handleImageChange = (ev) => {
    const selectedImage = ev.target.files[0];
    setImage(selectedImage);
    setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : null);
  };

  

  if (loading) {
    return "Loading user info....";
  }

  if (!data) {
    return "Not an admin";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-md mx-auto mt-8">
        <Link href={"/menu-items"} className="button">
          <Left />
          <span>show all menu items</span>
        </Link>
      </div>
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
                Select image
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

            <label>Category</label>
            <select
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="none">None</option>
              {categories.length > 0 &&
                categories.map((data) => (
                  <option key={data._id} value={data._id}>
                    {data.name}
                  </option>
                ))}
            </select>

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
                extraIngredientPrices.map((ingred, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div>
                      <label>ingredients name</label>
                      <input
                        type="text"
                        placeholder="ingredient name"
                        value={ingred.name}
                        onChange={(ev) => editIngred(ev, index, "name")}
                      />
                    </div>
                    <div>
                      <label>Extra price</label>
                      <input
                        type="text"
                        placeholder="Extra price"
                        value={ingred.price}
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
    </section>
  );
}
