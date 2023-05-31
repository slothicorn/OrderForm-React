import './OrderForm.css';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCartItem from './ProductCartItem';

const BasicInfoForm = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [cart, setCart] = useState([]);
  const totalPrice = cart
    .reduce((acc, cartItem) => {
      const subtotalPrice = cartItem.quantity * cartItem.price;

      acc += subtotalPrice;
      return acc;
    }, 0)
    .toFixed(2);

  const totalPriceWithVAT = (totalPrice * 1.21).toFixed(2);

  const onSubmit = (data) => {
    console.log('Form Submitted', data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://fakestoreapi.com/products?limit=10'
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (id) => {
    if (id === '') return;

    const productIndex = cart.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      const newProduct = products.find(
        (product) => product.id.toString() === id
      );

      const newProductWithQuantity = { ...newProduct, id: id, quantity: 1 };

      setCart((prevCart) => [...prevCart, newProductWithQuantity]);
      setSelectedProductId('');
      return;
    }

    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart[productIndex].quantity++;
      setSelectedProductId('');
      return newCart;
    });
  };

  const handleRemoveCartItem = (id) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== id);
      return newCart;
    });
  };

  // const handleIncrementCartItemQuantity = (id) => {
  //   const productIndex = cart.findIndex((product) => product.id === id);

  //   setCart((prevCart) => {
  //     const newCart = [...prevCart];
  //     newCart[productIndex].quantity++;
  //     return newCart;
  //   });
  // };

  const handleIncrementCartItemQuantity = (id) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const productIndex = newCart.findIndex((product) => product.id === id);
      newCart[productIndex] = {
        ...newCart[productIndex],
        quantity: newCart[productIndex].quantity + 1,
      };
      return newCart;
    });
  };

  // const handleDecrementCartItemQuantity = (id) => {
  //   const productIndex = cart.findIndex((product) => product.id === id);

  //   if (cart[productIndex].quantity === 1) {
  //     handleRemoveCartItem(id);
  //     return;
  //   }
  //   setCart((prevCart) => {
  //     const newCart = [...prevCart];
  //     newCart[productIndex].quantity--;
  //     return newCart;
  //   });
  // };

  const handleDecrementCartItemQuantity = (id) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const productIndex = newCart.findIndex((product) => product.id === id);
      if (newCart[productIndex].quantity === 1) {
        handleRemoveCartItem(id);
        return newCart;
      }
      newCart[productIndex] = {
        ...newCart[productIndex],
        quantity: newCart[productIndex].quantity - 1,
      };
      return newCart;
    });
  };

  return (
    <div className="wrapper">
      <div className="wrapper__menu menu">
        <label
          htmlFor="addProduct"
          className="menu__title">
          Vyberte Produkt
        </label>
        <select
          className="menu__select"
          value={selectedProductId}
          name="addProduct"
          id="addProduct"
          onChange={(e) => setSelectedProductId(e.target.value)}>
          <option
            className="menu__option"
            value="">
            --nevybráno
          </option>
          {products.map((product) => (
            <option
              className="menu__option"
              key={product.id}
              value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
        <button
          className="menu__addToCartBtn btn"
          type="button"
          onClick={() => handleAddProduct(selectedProductId)}>
          Přidat do košíku
        </button>
      </div>
      <form
        className="wrapper__form form"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="form__cart cart">
          {cart.map((item) => (
            <ProductCartItem
              product={item}
              key={item.id}
              handleRemoveCartItem={handleRemoveCartItem}
              handleIncrementCartItemQuantity={handleIncrementCartItemQuantity}
              handleDecrementCartItemQuantity={handleDecrementCartItemQuantity}
            />
          ))}
        </div>
        <div className="form__orderSummary">
          <div className="form__userDetails">
            <label
              className="userDetails__label"
              htmlFor="firstName">
              Jméno:
            </label>
            <div className="userDetails__inputWrapper">
              <input
                className="userDetails__input"
                type="text"
                id="firstName"
                {...register('firstName', {
                  required: {
                    value: true,
                    message: '*Povinný údaj',
                  },
                })}
              />
              {errors.firstName && (
                <p className="userDetails__errorMessage">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <label
              className="userDetails__label"
              htmlFor="lastName">
              Příjmení:
            </label>
            <div className="userDetails__inputWrapper">
              <input
                className="userDetails__input"
                type="text"
                id="lastName"
                {...register('lastName', {
                  required: {
                    value: true,
                    message: '*Povinný údaj',
                  },
                })}
              />
              {errors.lastName && (
                <p className="userDetails__errorMessage">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <label
              className="userDetails__label"
              htmlFor="email">
              E-mail:
            </label>
            <div className="userDetails__inputWrapper">
              <input
                className="userDetails__input"
                type="text"
                id="email"
                {...register('email', {
                  required: {
                    value: true,
                    message: '*Povinný údaj',
                  },
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: '*Neplatná adresa',
                  },
                  validate: {
                    notAdmin: (fieldValue) => {
                      return (
                        fieldValue !== 'admin@example.com' ||
                        '*Použijte jinou adresu'
                      );
                    },
                    notBlackListed: (fieldValue) => {
                      return (
                        (!fieldValue.endsWith('.co') &&
                          !fieldValue.endsWith('.om') &&
                          !fieldValue.endsWith('.cm') &&
                          !fieldValue.endsWith('.cy')) ||
                        '*Neplatná adresa'
                      );
                    },
                  },
                })}
              />
              {errors.email && (
                <p className="userDetails__errorMessage">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="form__totalPrice">
            <span className="form__priceType">celkem {totalPrice}Kč</span>
            <span className="form__priceType">{totalPriceWithVAT}Kč s DPH</span>
          </div>
        </div>
        <input
          className="form__submitBtn btn"
          type="submit"
          value="Pokračovat"
        />
      </form>
    </div>
  );
};

export default BasicInfoForm;
