"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call NextAuth's signIn function
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) setError("Invalid email or password");
    else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <form onSubmit={handleSubmit} className="text-white border-2 border-white p-4 rounded-sm flex flex-col gap-4">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="flex flex-col gap-2 items-start">
          <label>Email:</label>
          <input className="border-2 rounded-sm p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label>Password:</label>
          <input className="border-2 rounded-sm p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="bg-neutral-700 rounded-sm px-8 py-2 cursor-pointer">
          Log In
        </button>
      </form>
    </div>
  );
}
