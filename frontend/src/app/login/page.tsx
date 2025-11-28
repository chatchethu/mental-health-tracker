"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  async function handleLogin(e: any) {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return toast.error(data.message);

    localStorage.setItem("token", data.token);

    toast.success("Login successful!");
    router.push("/"); // redirect to dashboard
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-4 text-3xl font-bold text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute top-2.5 right-3"
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <Button className="w-full text-white bg-purple-600 hover:bg-purple-700">
            Login
          </Button>
        </form>

        <p className="mt-4 text-sm text-center">
          New user?{" "}
          <Link href="/signup" className="font-semibold text-purple-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
