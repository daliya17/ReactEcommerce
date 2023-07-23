import { applyMiddleware, combineReducers, createStore } from "redux";
import cartReducer from "./cart";
import categoryReducer from "./categories";
import thunk from "redux-thunk";

const reducer = combineReducers({
    cart: cartReducer,
    categories: categoryReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;