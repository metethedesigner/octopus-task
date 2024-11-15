import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "octopus_task/store";
import { login } from "octopus_task/store/slices/authSlice";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LoginPage(): JSX.Element {
  //Stateler
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Logini çağırıp form bilgilerini vererek istek atıyoruz.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password, rememberMe }));
  };

  // Token varsa /products sayfasına yönlendiriyoruz.
  useEffect(() => {
    if (token) {
      console.log("çalıştı");
      router.push("/products");
    }
  }, [token, router]);

  return (
    <div className="flex h-screen">
      {/* Sayfa Başlığı */}
      <Head>
        <title>Welcome to Octopus!</title>
      </Head>
      <div className="w-2/3 bg-gray-100 flex flex-col items-center justify-center p-10">
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
          </p>
        </div>
      </div>

      <div className="bg-white w-1/2 flex flex-col items-center justify-center px-10">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome Octopus!
        </h2>
        <p className="mb-8 text-gray-400">
          Manage your smart signage, watch your company grow.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Username*
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-500 text-sm"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Password*
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              id="rememberMe"
              className="rounded outline-none"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me?
            </label>
          </div>

          {status === "failed" && error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
