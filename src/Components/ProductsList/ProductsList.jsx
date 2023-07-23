import { memo, useEffect, useState } from "react";
import ProductCart from "../ProductCard";
import "./ProductsList.css";
import {Link} from "react-router-dom";
// const products = [
//   {
//     id: 1,
//     title: "Apple iPhone 14",
//     price: "Rs. 1,00,000"
//   },
//   {
//     id: 2,
//     title: "Apple iPhone 13",
//     price: "Rs. 70,000"
//   },
//   {
//     id: 3,
//     title: "Google Pixel 7",
//     price: "Rs. 50,000"
//   },
//   {
//     id: 4,
//     title: "Nokia 1100",
//     price: "Rs. 2,000"
//   },
//   {
//     id: 5,
//     title: "Samsung Galaxy S10",
//     price: "Rs. 1,00,000"
//   },
//   {
//     id: 6,
//     title: "Sony Xperia S10",
//     price: "Rs. 1,00,000"
//   }
// ];

// let promise = new Promise(function(resolve, reject){
//   resolve(products);
// })

// function getProductsAPI(callback) {
//   setTimeout(function () {
//     callback(products);
//   }, 1000)
// }

function ProductList() {
  const [isLoading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    fetch("https://602fc537a1e9d20017af105e.mockapi.io/api/v1//products")
      .then(function (response) {
        return response.json()
      })
      .then((res) => {
        setAllProducts(res);
        setLoading(false);
      });
    // getProductsAPI(function (res) {
    //   console.log("api started");
    //   setAllProducts(res);
    //   setLoading(false);
    //   console.log("api ended");
    // });
    // promise.then(function(res){
    //   setAllProducts(res);
    //   setLoading(false);
    // })
  }, [allProducts, isLoading]);

  if (isLoading) {
    return <img alt="loading" src="https://miro.medium.com/v2/resize:fit:1400/1*e_Loq49BI4WmN7o9ItTADg.gif" />
  }

  else {
    return (
      <>
      <Link to="/cart">cart</Link>
      <div className="products" >
        {allProducts.map(
          function (product) {
            return (<ProductCart product={product} key={product.id} />)
          }
        )}
      </div>
      </>
    );
  }
}

export default memo(ProductList);