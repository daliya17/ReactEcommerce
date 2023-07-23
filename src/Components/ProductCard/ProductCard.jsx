import Rating from "../Rating/Rating";
import ReduxAddToCart from "../ReduxAddToCart/ReduxAddToCart";
import "./ProductCard.css";
function ProductCart(props) {
    return (
        <div className="ProductCard">
            <h1>{props.product.title}</h1>
            <p>{props.product.price.value}</p>
            <Rating rating={props.product.rating.value} maxRating={5} size={1} />
            <ReduxAddToCart product={props.product} />
        </div>
    );
}

export default ProductCart;