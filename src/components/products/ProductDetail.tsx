import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "octopus_task/store/slices/productDetailSlice";
import { AppDispatch, RootState } from "octopus_task/store";
import Image from "next/image";
import { useRouter } from "next/router";
import { Header } from "octopus_task/layouts/Header";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { addToCart } from "octopus_task/store/slices/cartSlice";
import Head from "next/head";

export default function ProductDetail() {
  const { product } = useSelector((state: RootState) => state.productDetail);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  // Routerdan ürün ID'sini alarak ürün detayına istek atıyoruz.
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id as string));
    }
  }, [dispatch, id]);

  // Resim değiştirme fonksiyonlarımız.
  const handleNextImage = () => {
    if (product?.images) {
      setCurrentImageIndex(
        (prevIndex: any) => (prevIndex + 1) % product.images.length
      );
    }
  };

  const handlePreviousImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prevIndex: any) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Ürünü sepete eklediğimiz fonksiyonumuz.
  const handleAddToCart = () => {
    if (product) {
      const productData = { productId: product.id, quantity: 1 };
      dispatch(addToCart(productData));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Sayfa Başlığı */}
      <Head>
        <title>Product Detail</title>
      </Head>

      {/* Header */}
      <Header />

      <div className="container mx-auto pt-8 pb-24 flex">
        {product && (
          <>
            {/* Sol Taraf: Ürün Görselleri */}
            <div className="w-1/2 flex flex-col items-center pr-8">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-6 p-2 bg-white border rounded-full shadow-md hover:bg-gray-200"
                >
                  <FiChevronLeft size={24} color="black" />{" "}
                  {/* Sol ok simgesi */}
                </button>

                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="object-contain"
                />

                <button
                  onClick={handleNextImage}
                  className="absolute right-6 p-2 border rounded-full shadow-md hover:bg-gray-200"
                >
                  <FiChevronRight size={24} color="black" />{" "}
                  {/* Sağ ok simgesi */}
                </button>
              </div>

              {/* Küçük Resim Önizleme (Thumbnail) */}
              <div className="flex mt-4 space-x-2">
                {product.images.map((img: string, index: number) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className={`cursor-pointer border ${
                      index === currentImageIndex
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Sağ Taraf: Ürün Bilgileri */}
            <div className="w-1/2">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {product.title}
              </h1>
              <p className="text-lg text-gray-500 mb-4">
                {product.description}
              </p>
              <p className="text-2xl font-bold mb-4 text-gray-900">
                ${product.price}
              </p>

              {/* Renk Seçimi */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Renk Seç:
                </h3>
                <div className="flex space-x-4">
                  <button
                    className={`px-8 py-2 rounded-full border bg-black text-white hover:bg-gray-800`}
                  >
                    Siyah
                  </button>
                  <button
                    className={`px-8 py-2 rounded-full border bg-red-800 text-white hover:bg-red-700`}
                  >
                    Kırmızı
                  </button>
                </div>
              </div>

              {/* Özellik Seçimi */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Özellik Seç:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="px-4 py-2 border rounded-md text-left hover:bg-gray-200">
                    <p className="font-semibold text-gray-900">Özellik 1</p>
                    <p className="text-gray-500 text-sm">Özellik Açıklama</p>
                  </button>
                  <button className="px-4 py-2 border rounded-md text-left hover:bg-gray-200">
                    <p className="font-semibold text-gray-900">Özellik 2</p>
                    <p className="text-gray-500 text-sm">Özellik Açıklama</p>
                  </button>
                </div>
              </div>

              {/* Ürün Yorumları */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Ürün Yorumları
                </h2>
                <div className="space-y-4">
                  {product.reviews?.map((review: any, index: number) => (
                    <div key={index} className="border-b pb-4 mb-4">
                      <div className="flex items-center">
                        <p className="font-semibold mr-2 text-gray-900">
                          {review.reviewerName}
                        </p>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  <button className="bg-blue-950 py-2 px-4 rounded text-white hover:bg-blue-800">
                    Tümünü Gör
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sabit Sipariş Özeti ve Sepete Ekle Butonu */}
      <div className="sticky bottom-0 left-0 w-full bg-white p-4 border-t flex justify-between items-center">
        {/* Sipariş Özeti */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="font-extrabold text-xl text-gray-900 border-r-2 p-6">
              Sipariş Özeti
            </p>
          </div>
          <div className="font-semibold">
            <h3 className="text-gray-900 text-lg">{product?.title}</h3>
            <p className="text-gray-500 text-sm">{product?.description}</p>
          </div>
        </div>

        {/* Fiyat ve Sepete Ekle Butonu */}
        <div className="flex items-center space-x-6">
          <p className="text-3xl font-bold text-gray-900">₺{product?.price}</p>
          <button
            onClick={handleAddToCart}
            className="bg-buttonGreen text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
