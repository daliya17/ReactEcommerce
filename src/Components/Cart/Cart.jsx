import { useContext } from "react";
import CartContext from "../../Context/CartContext";
import useWindowSize from "../../Hooks/useWindowSize";
import { useSelector } from "react-redux";

function Cart() {
  //  const { cart } = useContext(CartContext);
  const cart = useSelector((state)=>{
    return state.cart.items;
  })
    const cartList = Object.values(cart);
    const windowSize = useWindowSize();
    let totalPrice = 0;
    cartList.map((item) => (
        totalPrice += (item.price.value * item.quantity)
    ))
    if (cartList.length === 0) {
        return <div>No items added</div>
    }
    else {
        return (
            <>
                <ol>
                    {
                        cartList.map((item) => (
                            <li key={item.id}  >
                                <div>{item.title}</div>
                                <div>quantity-{item.quantity}</div>
                                <div>price- {item.price.value * item.quantity}</div>
                            </li>
                        ))
                    }
                </ol>
                <span>Total - {totalPrice}</span>
            </>
        );
    }

}

export default Cart;