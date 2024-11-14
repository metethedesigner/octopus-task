import Image from "next/image";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="flex h-screen">
      {/* Left Section with Image and Text */}
      <div className="w-2/3 bg-gray-100 flex flex-col items-center justify-center p-10">
        {/* Logo at the top */}
        <div className="absolute top-8 left-8">
          <Image
            src="/assets/images/octopus-logo.png"
            alt="Octopus Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>

        <div className="w-5/6 flex flex-col items-center justify-center">
          <Image
            src="/assets/images/login-image.png"
            alt="Login Page Illustration"
            width={410}
            height={375}
            className="object-contain mb-8"
          />
          <h3 className="text-4xl font-bold text-left mb-4 leading-10 text-gray-900">
            Let Free Your Creativity with Our Intuitive Content Creator
          </h3>
          <p className="text-left text-gray-600">
            No design degree is required! Effortlessly craft and design stunning
            and captivating content using our user-friendly creative editor.
            With our drag-and-drop technology, anyone can create amazing
            marketing materials in.
          </p>
        </div>
      </div>

      {/* Right Section with Login Form */}
      <div className="bg-white w-1/2 flex flex-col items-center justify-center px-10">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome Octopus!
        </h2>
        <p className="mb-8 text-gray-400">
          Manage your smart signage, watch your company grow.
        </p>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              E-mail Address*
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your e-mail address"
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-500 text-sm"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password*
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="appearance-none w-full px-3 py-2 text-gray-500 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
            <div
              className="absolute inset-y-0 top-6 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700 rounded-lg"
            >
              Remember me?
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}