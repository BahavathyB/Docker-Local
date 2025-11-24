import React, { useEffect, useState } from "react";
import { ProductCard } from "../ShopComponent/ProductCard";
import axiosFetch from "../../Helper/Axios";

export const ListProduct = () => {
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosFetch({
        url: "product", // remove trailing /
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response && response.data) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section id="products" className="section product">
      <div className="container">
        <p className="section-subtitle"> -- Organic Products --</p>
        <h2 className="h2 section-title">All Organic Products</h2>

        <ul className="grid-list">
          {data.length > 0 ? (
            data.map((item) => (
              <ProductCard
                key={item.productid}
                id={item.productid}
                name={item.productName}
                description={item.description}
                price={item.price}
                img={item.img ? `data:image/png;base64,${item.img}` : null}
              />
            ))
          ) : (
            <p>No products found</p>
          )}
        </ul>
      </div>
    </section>
  );
};
