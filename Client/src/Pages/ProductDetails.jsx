import React, { useEffect, useState } from 'react'
import { Header } from '../Component/Header'
import { Footer } from '../Component/Footer'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ProductDetails = () => {
  
  const [data, setData] = useState(null); // change from [] to null
  const [quantity, setQuantity] = useState(1);
  const token = sessionStorage.getItem("token"); // no need for useState here
  const { id } = useParams();

  const handleQuantity = (e) => setQuantity(Number(e.target.value));

  const handleMinus = () => quantity > 1 && setQuantity(quantity - 1);
  const handlePlus = () => setQuantity(quantity + 1);

  const onToast = () => {
    toast.success('Added to cart!', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handleCart = async () => {
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/cart/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
        }),
      });

      if (res.ok) onToast();
      else toast.error("Failed to add product");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const headers = token ? { "Authorization": "Bearer " + token } : {};
        const response = await fetch(`http://localhost:8080/product/${id}`, { headers });
        
        if (!response.ok) {
          console.error("Failed to fetch product:", response.status);
          return;
        }

        const res = await response.json();
        setData(res);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }

    fetchData();
  }, [id, token]);

  if (!data) return <div>Loading...</div>; // prevent undefined errors

  return (
    <>
      <Header/>
      <div className="pd-wrap">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex justify-content-center">
              {data.img && <img className='productimg' width="167" height="250" src={`data:image/png;base64,${data.img}`} alt="Product"/>}
            </div>
            <div className="col-md-6">
              <div className="product-dtl">
                <div className="product-info">
                  <div className="product-name">{data.productName}</div>
                  <div className="product-price-discount">
                    <span>Rs {data.price}</span>
                    <span className="line-through">Rs {data.price + 100}</span>
                  </div>
                </div>
                <p>{data.productDescription}</p>
                <div className="product-count">
                  <label htmlFor="quantity">Quantity</label>
                  <div className="display-flex">
                    <div className="qtyminus" onClick={handleMinus}>-</div>
                    <input type="text" name="quantity" value={quantity} onChange={handleQuantity} className="qty" />
                    <div className="qtyplus" onClick={handlePlus}>+</div>
                  </div>
                  <button className="round-black-btn" onClick={handleCart}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
