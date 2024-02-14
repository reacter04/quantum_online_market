import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../Redux/api/productsApi";
import ProductItem from "./product/ProductItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";

function Home() {
  const { data, isLoading, error, isError } = useGetProductsQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error, isError]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy best products online"} />
      <div className="col-12 col-sm-6 col-md-12">
        <h1 id="products_heading" className="text-secondary">
          Latest Products
        </h1>
        <section id="products" className="mt-5">
          <div className="row">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
