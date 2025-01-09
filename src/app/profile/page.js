"use client";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "../../components/layout/UserTabs"

export default function ProfilePage() {
  const session = useSession();
  console.log("session==>>", session);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isAdmin,setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const { status } = session;

  useEffect(() => {
    if (status === "authenticated") {
      setUsername(session.data.user.name);
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          console.log(data);
          setPhone(data.phone);
          setStreetAddress(data.streetAddress);
          setPostalCode(data.postalCode);
          setCity(data.city);
          setCountry(data.country);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        });
      });
    }
  }, [session, status]);

  async function handleProfileInfoUpdate(ev) {
    ev.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          streetAddress,
          phone,
          postalCode,
          city,
          country,
        }),
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile saved!",
      error: "Error saving profile",
    });
  }

  // async function handleFileChange(ev) {
  //   const files = ev.target.files;
  //   const formData = new FormData();
  //   formData.append('file', files[0]);

  //   const response = await fetch('/api/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const result = await response.json();

  //   console.log(result);

  //   // if (files?.length === 1) {
  //     // const data = new FormData();
  //     // data.append("file", files[0]);

  //     // const response = await fetch("/api/upload", {
  //     //   method: "POST",
  //     //   body: data,
  //     // });
  //     // try {
  //     //   const response = await fetch("/api/upload", {
  //     //     method: "POST",
  //     //     body: data,
  //     //   });
  //     //   console.log("response====>>",response);
  //     //   if (response.ok) {
  //     //     const result = await response.json();
  //     //     // Optionally update the user image with the response data
  //     //     console.log(result);
  //     //   } else {
  //     //     const error = await response.json();
  //     //     console.error("Upload failed:", error.message);
  //     //   }
  //     // } catch (error) {
  //     //   console.error("An error occurred while uploading the file:", error);
  //     // }
  //     // if (response.ok) {
  //     //   const result = await response.json();
  //     //   // Optionally update the user image with the response data
  //     //   // For example:
  //     //   // setUserImage(result.filePath);
  //     // }
  //   // }
  //   console.log(ev.target.files);
  // }
  //4:39:23

  if (status === "loading" || !profileFetched ) {
    return "Loading...";
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  console.log(session?.data?.user?.name);

  // const userImage = session.data.user.image;

  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />     
      <div className="max-w-md mx-auto mt-8">
        <div className="flex gap-4 items-center">
          <div>
            {/* <div className="p-2 rounded-lg relative">
              <Image
                className="rounded-lg w-full h-full mb-2"
                src={userImage}
                width={250}
                height={250}
                alt="profile_img"
              />
              <label>
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
                  Edit
                </span>
              </label>
            </div> */}
          </div>
          <form className="grow" onSubmit={handleProfileInfoUpdate}>
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
              disabled={true}
              value={session.data.user.email}
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
            <div className="grid grid-cols-2 gap-4">
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
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </section>
  );
}
