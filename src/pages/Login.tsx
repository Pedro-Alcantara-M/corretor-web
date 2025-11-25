import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@services/queryClient";
import { loginUser } from "@services/auth/auth.service";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navitate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate,
    isError,
    error,
    isPending: loading,
  } = useMutation({
    mutationKey: ["token"],
    mutationFn: loginUser,
    onSuccess: (response: {access_token: string}) => {
      localStorage.setItem("token", response.access_token);
      queryClient.invalidateQueries({ queryKey: ["token"] });
      navitate("/home");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {isError && (
            <p className="text-red-500 text-sm">
              {(error as any)?.response?.data?.message || "Login failed"}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
