import { useContext } from "react";
import CartContext from "../../Context/CartContext";

function AddToCart({ product }) {
  const {cart, increaseQuantity, decreaseQuantity} = useContext(CartContext);
  console.log("Add to cart " + product.id)
  function addQuantity() {
    increaseQuantity(product);
    localStorage.setItem("cart",JSON.stringify(cart));
  }
  function reduceQuantity() {
    decreaseQuantity(product);
  }
  let quantity = cart[product.id] ? cart[product.id].quantity : 0;
  if (quantity > 0) {
    return <div>
      <button onClick={reduceQuantity}>-</button>
      <span>{quantity}</span>
      <button onClick={addQuantity}>+</button>
    </div>
  }
  else {
    return <button onClick={addQuantity}>Add to cart</button>
  }
}

export default AddToCart;