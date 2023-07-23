import { useDispatch, useSelector } from "react-redux";


function ReduxAddToCart({ product }) {

    const dispath = useDispatch();
    const quantity = useSelector((state) => {
        return state.items[product.id]?.quantity || 0;
    })
    console.log("Add to cart " + product.id)
    function addQuantity() {
        dispath({ type: "ADD_TO_CART", payload: product });
      //  localStorage.setItem("cart", JSON.stringify(cart));
    }
    function reduceQuantity() {
        dispath({ type: "REMOVE_FROM_CART", payload: product });
    }
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

export default ReduxAddToCart;