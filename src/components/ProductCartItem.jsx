import PropTypes from 'prop-types';
import './ProductCartItem.css';

const ProductCartItem = ({
  product,
  handleRemoveCartItem,
  handleIncrementCartItemQuantity,
  handleDecrementCartItemQuantity,
}) => {
  const maxTitleLength = 30;
  const longTitle = product.title.length > maxTitleLength;
  const formattedTitle = longTitle
    ? `${product.title.slice(0, maxTitleLength)}...`
    : product.title;

  return (
    <div className="cart__item item">
      <label
        className="item__title"
        htmlFor={product.id}>
        {formattedTitle}
      </label>
      <span className="item__currency">{`${product.price}Kč/ks (bez DPH)`}</span>
      <button
        className="item__inputControlBtn"
        type="button"
        onClick={() => handleDecrementCartItemQuantity(product.id)}>
        -
      </button>
      <input
        className="item__quantity"
        readOnly
        value={product.quantity}
        id={product.id}
        type="number"
        step={1}
        onChange={() => {}}
      />
      <button
        className="item__inputControlBtn"
        type="button"
        onClick={() => handleIncrementCartItemQuantity(product.id)}>
        +
      </button>
      <button
        className="item__inputControlBtn"
        type="button"
        onClick={() => handleRemoveCartItem(product.id)}>
        &times;
      </button>
    </div>
  );
};

ProductCartItem.propTypes = {
  product: PropTypes.object,
  handleRemoveCartItem: PropTypes.func,
  handleIncrementCartItemQuantity: PropTypes.func,
  handleDecrementCartItemQuantity: PropTypes.func,
};

export default ProductCartItem;
