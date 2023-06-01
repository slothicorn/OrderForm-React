import './OrderForm.css';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCartItem from './ProductCartItem';
import { AnimatePresence } from 'framer-motion';
import ModalSummary from './ModalSummary';

const BasicInfoForm = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });
  const { register, handleSubmit, formState, setValue, unregister } = form;
  const { errors, isValid } = formState;

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const [currencies, setCurrencies] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const [submitData, setSubmitData] = useState({});

  const [cart, setCart] = useState([]);
  const totalPrice = cart
    .reduce((acc, cartItem) => {
      const subtotalPrice = cartItem.quantity * cartItem.price;

      acc += subtotalPrice;
      return acc;
    }, 0)
    .toFixed(2);

  const totalPriceConverted =
    (
      (totalPrice * currencies.USD?.dev_stred) /
      currencies[selectedCurrency]?.dev_stred
    ).toFixed(2) ?? totalPrice;

  const totalPriceWithVAT = (totalPriceConverted * 1.21).toFixed();

  const canBeOrdered = cart.length > 0 && isValid;

  const onSubmit = (data) => {
    console.log('Form Submitted', data);
    setSubmitData(data);
  };

  const [show, setShow] = useState(false);

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

    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          'https://data.kurzy.cz/json/meny/b[1].json'
        );
        setCurrencies(response.data.kurzy);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
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

    handleIncrementCartItemQuantity(id);
  };

  const handleRemoveCartItem = (id) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== id);

      unregister(`products.${id}`);

      return newCart;
    });
  };

  const handleIncrementCartItemQuantity = (id) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const productIndex = newCart.findIndex((product) => product.id === id);
      const updatedProductQuantity = newCart[productIndex].quantity + 1;
      newCart[productIndex] = {
        ...newCart[productIndex],
        quantity: updatedProductQuantity,
      };

      setValue(`products.${id}`, updatedProductQuantity);

      return newCart;
    });
  };

  const handleDecrementCartItemQuantity = (id) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const productIndex = newCart.findIndex((product) => product.id === id);
      if (newCart[productIndex].quantity === 1) {
        handleRemoveCartItem(id);
        return newCart;
      }
      const updatedProductQuantity = newCart[productIndex].quantity - 1;
      newCart[productIndex] = {
        ...newCart[productIndex],
        quantity: updatedProductQuantity,
      };

      setValue(`products.${id}`, updatedProductQuantity);

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
          <AnimatePresence>
            {cart.map((item) => (
              <ProductCartItem
                product={item}
                key={item.id}
                handleRemoveCartItem={handleRemoveCartItem}
                handleIncrementCartItemQuantity={
                  handleIncrementCartItemQuantity
                }
                handleDecrementCartItemQuantity={
                  handleDecrementCartItemQuantity
                }
                selectedCurrency={selectedCurrency}
                register={register}
              />
            ))}
          </AnimatePresence>
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
            <span className="form__priceType">
              celkem: {totalPriceConverted} {selectedCurrency}
            </span>
            <span className="form__priceType">
              {totalPriceWithVAT} {selectedCurrency} s DPH
            </span>
            <select
              name="currency"
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}>
              {Object.keys(currencies).map((currency) => (
                <option
                  className="menu__option"
                  key={currency}
                  value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input
          className="form__submitBtn btn"
          type="submit"
          value="Pokračovat"
          onClick={() => {
            setShow(true);
          }}
          disabled={!canBeOrdered}
        />
      </form>
      <AnimatePresence>
        <ModalSummary
          show={show}
          submitData={submitData}
          onConfirm={() => {
            setShow(false);
          }}
          totalPriceWithVAT={totalPriceWithVAT}
          selectedCurrency={selectedCurrency}
        />
      </AnimatePresence>
    </div>
  );
};

export default BasicInfoForm;
