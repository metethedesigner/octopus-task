import { useEffect, useState } from "react";
import { Header } from "octopus_task/layouts/Header";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "octopus_task/store/slices/productSlice";
import { AppDispatch, RootState } from "octopus_task/store";
import {
  fetchCategories,
  fetchProductsByCategory,
} from "octopus_task/store/slices/categorySlice";
import Link from "next/link";

export default function ProductList(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  // Ürünler
  const { items: products, total } = useSelector(
    (state: RootState) => state.product
  );

  // Kategoriler
  const { categories, selectedCategoryProducts, selectedCategoryTotal } =
    useSelector((state: RootState) => state.category);

  // Stateler
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);
  const [appliedPage, setAppliedPage] = useState(1);
  const productsPerPage = 9;

  // totalPages, seçilen kategori varsa onu yoksa genel listeyi hesaplayacak şekilde oluşturduk.
  const totalPages = appliedCategory
    ? Math.ceil(selectedCategoryTotal / productsPerPage)
    : Math.ceil(total / productsPerPage);

  useEffect(() => {
    dispatch(fetchCategories());

    // Kategori seçtiysek filtreleri ürünleri çekeceğiz
    if (appliedCategory) {
      dispatch(
        fetchProductsByCategory({
          category: appliedCategory,
          page: appliedPage,
        })
      );
    } else {
      dispatch(fetchProducts(appliedPage));
    }
  }, [dispatch, appliedCategory, appliedPage]);

  // Sayfa güncelleme fonksiyonumuz, filtreleme yaptığımızda gelen ürün sayısına göre sayfayı güncelliyoruz.
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      setAppliedPage(page);
    }
  };

  // Kategori seçim fonksiyonumuz, aynı kategoriye tıklanırsa seçimi kaldırıyoruz.
  const handleCategoryChange = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(slug);
      setCurrentPage(1);
    }
  };

  // Filtreleri uygulamak için "Filtrele" butonuna basılınca ürünleri ve sayfayı güncelliyoruz.
  const applyFilters = () => {
    setAppliedCategory(selectedCategory);
    setAppliedPage(currentPage);
  };

  // Kategori seçili ise seçilene göre değil ise genel ürün listesine göre ürün listeliyor ve totali güncelliyoruz.
  const displayedProducts = appliedCategory
    ? selectedCategoryProducts
    : products;
  const currentTotal = appliedCategory ? selectedCategoryTotal : total;

  // Sayfalama yaparken seçili sayfanın öncesinde ve sonrasında maks 2 adet sayfa kutucuğu gösterecek şekilde tasarım düzenlemesi yapıyorum.
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const range = 2;

    if (currentPage > 1 + range) {
      pageNumbers.push(1);
      if (currentPage > 2 + range) {
        pageNumbers.push("...");
      }
    }

    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - range) {
      if (currentPage < totalPages - range - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((page, index) =>
      typeof page === "number" ? (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={`flex items-center justify-center px-3 h-8 leading-tight ${
            currentPage === page
              ? "text-white bg-buttonGreen"
              : "text-gray-500 bg-white hover:bg-gray-100"
          } border border-gray-300 rounded-md mx-1`}
        >
          {page}
        </button>
      ) : (
        <span
          key={index}
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-md mx-1"
        >
          {page}
        </span>
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Alanı*/}
      <div className="h-20">
        <Header />
      </div>
      {/* Genel İçerik */}
      <main className="bg-gray-100 px-12 flex-grow justify-center flex">
        {/* Sol Kategori Alanımız */}
        <aside className="w-1/4 p-12 border-r">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Quick search"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <h3 className="font-bold text-xl text-gray-900 mb-4">Kategoriler</h3>
          <div className="border-b-4 border-black mb-4"></div>
          <ul className="max-h-96 px-4 overflow-y-scroll custom-scrollbar">
            {categories.map((category) => (
              <li key={category.slug} className="mb-2">
                <input
                  type="checkbox"
                  id={`kategori-${category.slug}`}
                  name="category"
                  className="mr-2 rounded"
                  onChange={() => handleCategoryChange(category.slug)}
                  checked={selectedCategory === category.slug}
                />
                <label
                  className="text-gray-900 font-semibold"
                  htmlFor={`kategori-${category.slug}`}
                >
                  {category.name}
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={applyFilters}
            className="bg-blue-950 w-full text-white px-4 py-4 rounded-md mt-4"
          >
            Filtrele
          </button>
        </aside>

        {/* Ürün Listesi Alanımız */}
        <section className="flex-grow p-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {currentTotal} Ürün Listeleniyor
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <div key={product.id} className="rounded-md p-4">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={310}
                    height={150}
                    className="object-cover mb-4 cursor-pointer"
                  />
                </Link>
                <Link
                  className="text-lg text-gray-900 font-semibold mb-2 hover:underline"
                  href={`/products/${product.id}`}
                >
                  {product.title}
                </Link>
                <p className="text-gray-600 mb-2">{product.brand}</p>
                <p className="font-extrabold text-gray-900 text-lg mb-2">
                  {product.price} ₺
                </p>
                <div className="flex items-center mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <span
                        key={index}
                        className={`text-2xl ${
                          index < product.rating
                            ? "text-black"
                            : "text-gray-300"
                        }`}
                      >
                        &#9733;
                      </span>
                    ))}
                </div>
                <button className="w-full bg-buttonGreen text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                  Sepete Ekle
                </button>
              </div>
            ))}
          </div>
          <nav
            aria-label="Page navigation example"
            className="flex justify-center mt-8"
          >
            <ul className="inline-flex items-center text-sm space-x-1">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 font-semibold border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700  disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
              </li>
              {renderPageNumbers()}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-900 font-semibold border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700  disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </section>
      </main>
    </div>
  );
}
