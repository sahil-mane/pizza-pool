"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserTabs from "../../../components/layout/UserTabs";
import useProfile from "../../../components/UseProfile";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [admin, setAdmin] = useState(false);
  const { loading, data } = useProfile();

  const { data: loggedInUserData } = useProfile();

  useEffect(() => {
    fetch("/api/profile?_id=" + id)
      .then((response) => response.json())
      .then((userData) => {
        console.log(userData);
        setUsername(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone);
        setStreetAddress(userData.streetAddress);
        setPostalCode(userData.postalCode);
        setCity(userData.city);
        setCountry(userData.country);
        setAdmin(userData.admin);
      });
  }, []);

  async function handleSaveButtonClick(ev) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile?", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: id,
          name: username,
          email,
          phone,
          streetAddress,
          postalCode,
          city,
          country,
          admin
        }),
      });

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
        loading: "Saving user...",
        success: "User saved ",
        error: "An error has occurred while saving the user",
    });
  }

  if (loading) {
    return "Loading user profile...";
  }

  if (!data) {
    return "Not an admin";
  }

  return (
    <section className="mt-8 mx-auto max-w-md">
      <UserTabs isAdmin={true} />
      <div className="flex gap-4 items-center mt-8">
        <form className="grow" onSubmit={handleSaveButtonClick}>
          <label>First and last name</label>
          <input
            type="text"
            className="text-center"
            placeholder="First and last name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            className="text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Phone</label>
          <input
            type="tel"
            placeholder="Phone number"
            className="text-center"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label>Street address</label>
          <input
            type="text"
            placeholder="Street address"
            className="text-center"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label>postal code</label>
              <input
                type="text"
                placeholder="Postal code"
                className="text-center"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div>
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                className="text-center"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <label>Country</label>
          <input
            type="text"
            placeholder="Country"
            className="text-center"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {loggedInUserData && (
            <div>
              <label
                className="p-2 inline-flex items-center gap-2 mb-2"
                htmlFor="adminCb"
              >
                <input
                  id="adminCb"
                  type="checkbox"
                  className=""
                  value={"1"}
                  checked={admin}
                  onClick={(ev) => setAdmin(ev.target.checked)}
                />
                <span>Admin</span>
              </label>
            </div>
          )}
          <button type="submit">Save</button>
        </form>
      </div>
    </section>
  );
}
