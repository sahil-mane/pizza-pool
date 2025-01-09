"use client";
import { useEffect, useState } from "react";
import { Left } from "../../../../components/icons/Left";
import UserTabs from "../../../../components/layout/UserTabs";
import useProfile from "../../../../components/UseProfile";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { BsTrash3 } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
// import MenuItemForm from "../../../../components/layout/MenuItemForm";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [redirectToUrl, setRedirectToUrl] = useState(false);
  const [oldPublicId, setOldPublicId] = useState("");
  const [sizes, setSizes] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState([]);
  const [open, setOpen] = useState(false);
  const [openIngred, setOpenIngred] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const { loading, data } = useProfile();

  const fetchCategory = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    console.log("daddatdajhdbhj==>>>>", data);
    setCategories(data);
  };

  const fetchMenu = async () => {
    const response = await fetch("/api/menu-items");
    const data = await response.json();
    const singleItem = data.data.find((data) => data._id === id);

    console.warn(singleItem);

    if (singleItem) {
      setName(singleItem.name);
      setDescription(singleItem.description);
      setBasePrice(singleItem.basePrice);
      setImage(singleItem.image);
      setImagePreview(singleItem.image);
      setOldPublicId(singleItem.public_id);
      setSizes(singleItem.sizes);
      setExtraIngredientPrices(singleItem.extraIngredientPrices);
      setCategory(singleItem.category);
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMenu(), fetchCategory()]);
    };
    fetchData();
  }, []);

  const handleSubmitMenu = async (ev) => {
    ev.preventDefault();
    const menuData = new FormData();
    menuData.append("name", name);
    menuData.append("description", description);
    menuData.append("basePrice", basePrice);
    menuData.append("category", category);
    menuData.append("sizes", JSON.stringify(sizes));
    menuData.append(
      "extraIngredientPrices",
      JSON.stringify(extraIngredientPrices)
    );

    if (image) {
      menuData.append("image", image);
    } else {
      menuData.append("image", imagePreview);
    }

    menuData.append("public_id", oldPublicId);

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "PUT",
        body: menuData,
      });
      if (response.ok) {
        resolve();
        console.log("list====>>>", response);
      } else {
        reject();
        console.warn("list error ====>>>", menuData);
      }
    });

    await toast.promise(savingPromise, {
      loading: "updating this tasty item",
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

  const handleDelete = async () => {
    const MenuItemPromise = new Promise(async (resolve, reject) => {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(MenuItemPromise, {
      loading: "Deleting this tasty item",
      success: "Deleted!",
      error: "Error",
    });

    setRedirectToUrl(true);
  };

  if (redirectToUrl) {
    return redirect("/menu-items");
  }

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
                Edit
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

            <label>Categories</label>
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

            <label>Base price</label>
            <input
              type="text"
              name="price"
              value={basePrice}
              onChange={(ev) => setBasePrice(ev.target.value)}
            />
            <div className="bg-gray-200 p-2 rounded-md mb-2">
              <button
                type="button"
                className="inline-flex border-0 items-center justify-start w-fit"
                onClick={() => setOpen((prev) => !prev)}
              >
                {open ? <IoIosArrowUp /> : <IoIosArrowDown />}

                <span>Sizes</span>
                <span>({sizes?.length})</span>
              </button>
              <div className={open ? "block" : "hidden"}>
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
            </div>
            <div className="bg-gray-200 p-2 rounded-md mb-2">
              <button
                type="button"
                className="inline-flex border-0 items-center justify-start w-fit"
                onClick={() => setOpenIngred((prev) => !prev)}
              >
                {openIngred ? <IoIosArrowUp /> : <IoIosArrowDown />}

                <span>Extra Ingredients</span>
                <span>({extraIngredientPrices?.length})</span>
              </button>
              <div className={openIngred ? "block" : "hidden"}>
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
            </div>
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
      <div className="max-w-md mx-auto mt-4 ">
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="button text-white"
        >
          Delete this menu item
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this menu item?</p>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <MenuItemForm {...formProps} /> Spread formProps here */}
    </section>
  );
}
