"use client";
import { useEffect, useState } from "react";
import UserTabs from "../../components/layout/UserTabs";
import useProfile from "../../components/UseProfile.js";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // State for showing modal
  const [categoryToDelete, setCategoryToDelete] = useState(null);  // State to store category being deleted

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        setCategories(categories);
      });
    });
  };

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    const creativePromise = new Promise(async (resolve, reject) => {
      const data = { name: categoryName };
      if (editedCategory) {
        data._id = editedCategory._id;
      }
      const response = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      setCategoryName("");
      fetchCategories();
      setEditedCategory(null);
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });
    await toast.promise(creativePromise, {
      loading: editedCategory ? "Updating category..." : "Creating your new category....",
      success: editedCategory ? "Category Updated" : "Category Created",
      error: "Error, sorry...",
    });
  }

  const handleDelete = async () => {
    console.log("Deleting category with id:", categoryToDelete);
    const deletePromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryToDelete }), // Send `id` in the request body
      });
      setCategoryName("");
      fetchCategories();
      setEditedCategory(null);
      setShowDeleteModal(false); // Close the modal after delete

      if (response.ok) {
        resolve();
        console.log("Delete successful");
      } else {
        reject();
        console.error("Delete failed", response.statusText);
      }
    });
    await toast.promise(deletePromise, {
      loading: "Deleting category...",
      success: "Category deleted",
      error: "Error",
    });
  };

  if (profileLoading) {
    return "Loading user info...";
  }

  if (!profileData) {
    return "Not an admin";
  }

  return (
    <section className="mt-8 max-w-md mx-auto">
      <UserTabs isAdmin={true} />
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? "Update category" : "New category name"}
              {editedCategory && <><b>{editedCategory.name}</b></>}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(ev) => setCategoryName(ev.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button type="submit" className="border border-primary">
              {editedCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Edit category:</h2>
        {categories.length > 0 &&
          categories.map((c) => (
            <div
              className="bg-gray-200 rounded-xl p-2 px-4 border-0 flex gap-1 cursor-pointer mb-2"
              key={c._id}
            >
              <div className="grow py-2 hover:underline cursor-pointer">
                <span>{c.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(c);
                    setCategoryName(c.name);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryToDelete(c._id); // Set category to delete
                    setShowDeleteModal(true); // Show modal
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal for confirmation */}
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
                onClick={handleDelete} // Call handleDelete
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
