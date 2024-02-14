import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../Redux/api/productsApi";
import StarRatings from "react-star-ratings";
function ProductDetails() {
  const params = useParams();
  const { data } = useGetProductDetailsQuery(params?.id);
  const product = data?.product;

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    setActiveImage(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);

  return (
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3">
          <img
            className="d-block w-100"
            src={activeImage}
            alt={product?.name}
            width="340"
            height="390"
          />
        </div>
        <div className="row justify-content-start mt-5">
          {product?.images.map((img) => (
            <div className="col-2 ms-4 mt-2">
              <a role="button">
                <img
                  className={`d-block border rounded p-3 cursor-pointer ${img?.url === activeImage ? "border-warning" : ""}`}
                  height="100"
                  width="100"
                  src={img?.url}
                  alt={img?.name}
                  onClick={()=>{setActiveImage(img?.url)}}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3></h3>
        <p id="product_id">Product #{product?._id}</p>

        <hr />

        <div className="d-flex">
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            starDimension="24px"
            starSpacing="1px"
          />
          <span id="no-of-reviews" className="pt-1 ps-2">
            {" "}
            {product?.numOfReviews}{" "}
          </span>
        </div>
        <hr />

        <p id="product_price">{product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus">-</span>
          <input
            type="number"
            className="form-control count d-inline"
            value="1"
            readonly
          />
          <span className="btn btn-primary plus">+</span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          disabled=""
        >
          Add to cart
        </button>

        <hr />

        <p>
          Status:{" "}
          <span
            id="stock_status"
            className={product?.stock ? "greenColor" : "redColor"}
          >
            {product?.stock ? "In stock" : "Out of stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>{product?.description}</p>
        <hr />
        <p id="product_seller mb-3">
          Sold by: <strong>{product?.seller}</strong>
        </p>

        <div className="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
