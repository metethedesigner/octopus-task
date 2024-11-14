import Image from "next/image";
import { FaSearch, FaUserCircle } from "react-icons/fa";

export function Header(): JSX.Element {
  return (
    <header className="bg-white w-full h-20 shadow-md p-4 flex fix-between">
      {/* Sol Logo */}
      <div className="flex items-center">
        <Image
          src="/assets/images/octopus-logo.png"
          alt="Octopus Logo"
          width={150}
          height={50}
          className="object-contain mr-auto"
        />
      </div>
      {/* Sağ taraf kullanıcı bilgisi */}
      <div className="flex items-center space-x-6">
        <FaSearch className="text-gray-600 cursor-pointer text-xl" />
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-gray-600 text-2xl" />
          <span className="font-medium text-gray-700">Selin Gülce</span>
        </div>
      </div>
    </header>
  );
}
