import './App.css';
import { useState } from 'react';
import CartContext from './Context/CartContext';
import ProductsPage from './Pages/Products/ProductsPage';
import CartPage from './Pages/Cart/CartPage';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';

function App() {
  let [cart, setcart] = useState({});
  if (Object.keys(cart).length === 0) {
    // cart = JSON.parse(localStorage.getItem("cart"));
  }
  function increaseQuantity(product) {
    const newCart = { ...cart };
    if (!newCart[product.id]) {
      newCart[product.id] = {
        id: product.id,
        title: product.title,
        price: product.price.value,
        quantity: 0
      }
    }
    newCart[product.id].quantity += 1;
    setcart(newCart);
  }

  function decreaseQuantity(product) {
    const newCart = { ...cart };
    if (newCart[product.id]) {
      newCart[product.id].quantity--;
    }
    if (newCart[product.id].quantity <= 0) {
      delete newCart[product.id];
    }
    setcart(newCart);
  }
  //const cartLength = Object.keys(cart).length;
  return (
    <CartContext.Provider value={{ cart, increaseQuantity, decreaseQuantity }} >
      <Switch>
        <Route exact={true} path="/" component={ProductsPage} />
        <Route exact={true} path="/cart" component={CartPage} />
        <Route component={NotFoundPage}/>
      </Switch>
    </CartContext.Provider>
  );
}

export default App;
