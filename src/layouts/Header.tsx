import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "octopus_task/store";
import { logout } from "octopus_task/store/slices/authSlice";
import { useEffect, useState } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export function Header(): JSX.Element {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  // İstemci tarafında render yapılacağını belirtmek için isClient'ı true yapıyoruz.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Token yoksa login sayfasına yönlendiriyoruz.
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <header className="bg-white w-full h-20 shadow-md p-4 px-12 flex fix-between">
      {/* Sol Logo */}
      <div className="flex items-center">
        <Link href={`/products`}>
          <Image
            src="/assets/images/octopus-logo.png"
            alt="Octopus Logo"
            width={150}
            height={50}
            className="object-contain mr-auto"
          />
        </Link>
      </div>
      {/* Sağ taraf kullanıcı bilgisi */}
      <div className="flex items-center space-x-6">
        {isClient && (
          <div
            className="flex items-center space-x-4 cursor-pointer relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <FaUserCircle size={36} className="text-gray-600 text-2xl" />
            <span className="font-medium text-gray-700">
              {user?.firstName ? user?.firstName : "username"}
            </span>
            <FaChevronDown size={16} className="text-gray-600" />

            {dropdownOpen && (
              <div className="absolute left-4 top-8 w-full bg-white border rounded-md shadow-lg z-10">
                <button className="block w-full px-16 py-2 text-center text-gray-700 hover:bg-gray-100">
                  Profil
                </button>
                <button className="block w-full px-16 py-2 text-center text-gray-700 hover:bg-gray-100">
                  Ayarlar
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-16 py-2 text-center text-gray-700 hover:bg-gray-100"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
