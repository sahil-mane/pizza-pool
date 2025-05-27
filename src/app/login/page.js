"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import google from "../../../public/google.png";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    await signIn("credentials", { email, password, callbackUrl: "/" });

    setLoginInProgress(false);
  }

  return (
    <section>
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex justify-center gap-4"
        >
          <Image src={google} alt="google" width={24} height={24} />
          Login with google
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <input
          type="email"
          placeholder="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          disabled={loginInProgress|| true}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          disabled={loginInProgress || true}
        />
        {/* <button type="submit">Login</button> */}

      </form>
    </section>
  );
}
