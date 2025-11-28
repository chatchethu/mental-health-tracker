"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    password: "",
  });

  function update(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup(e: any) {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) return toast.error(data.message);

    toast.success("Account created!");
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-100 to-blue-100">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-4 text-3xl font-bold text-center">Create Account</h1>

        <form className="space-y-4" onSubmit={handleSignup}>
          <input name="name" placeholder="Full Name" className="w-full px-3 py-2 border rounded-lg" onChange={update} />
          <input name="age" placeholder="Age" className="w-full px-3 py-2 border rounded-lg" onChange={update} />

          <select name="gender" className="w-full px-3 py-2 border rounded-lg" onChange={update}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input name="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg" onChange={update} />
          <input name="password" placeholder="Password" type="password" className="w-full px-3 py-2 border rounded-lg" onChange={update} />

          <Button className="w-full text-white bg-purple-600 hover:bg-purple-700">Create Account</Button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-purple-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
