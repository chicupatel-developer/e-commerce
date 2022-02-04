import React, { useState, useEffect } from 'react';

import { Products, Navbar, Cart, Checkout, NotFound } from './components';
import { commerce } from './lib/commerce';

import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import commerceJsWebApi from './services/commerceJs-webApi';


const App = () => {


    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    // get products from api
    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    // get user's cart from api
    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    // when user add item to cart
    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        setCart(item.cart);
    }

    // when user update qty(+1/-1) of item in cart
    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, { quantity });
        setCart(response.cart);
    };

    // when user remove item(0) from cart
    const handleRemoveFromCart = async (lineItemId) => {
        const response = await commerce.cart.remove(lineItemId);
        setCart(response.cart);
    };

    // when user empty the whole cart
    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();
        setCart(response.cart);
    };

    // refresh cart
    const refreshCart = async () => {
        const emptyCart = await commerce.cart.refresh();
        setCart(emptyCart);
    };

    // check out
    /*
        chkt_Op1YoVxeL6lXLv
        {line_items: Array(1), customer: {…}, shipping: {…}, fulfillment: {…}, payment: {…}}
        POST https://api.chec.io/v1/checkouts/chkt_Op1YoVxeL6lXLv 422
        Validation/missing fields
        payment.gateway: The selected payment.gateway is invalid.
    */
    // stripe and commerce.js is not connected
    // so, getting following error,,, 
    // payment.gateway: The selected payment.gateway is invalid.
    // create web api project for sending email confirmation with order details
    // to shopper and finally reset(refresh) cart object on react-client side 
    const handleCaptureCheckout = async (checkoutTokenId, newOrder, grandTotal) => {
        try {
            console.log(checkoutTokenId);
            console.log(newOrder);

            // prepare shoppingData object for api call
            let shoppingData = {
                shopperInfo: {
                    firstName: newOrder.customer.firstname,
                    lastName: newOrder.customer.lastname,
                    email: newOrder.customer.email
                },
                shippingData: {
                    shippingMethod: newOrder.fulfillment.shipping_method,
                    country: newOrder.shipping.country,
                    state: newOrder.shipping.county_state,
                    shippingType: newOrder.shipping.name,
                    postalZipCode: newOrder.shipping.postal_zip_code,
                    street: newOrder.shipping.street,
                    city: newOrder.shipping.town_city
                },
                paymentData: {
                    gateway: newOrder.payment.gateway,
                    paymentMethodId: newOrder.payment.stripe.payment_method_id
                },
                lineItems: [],
                grandTotal: grandTotal
            };
            let lineItems = [];
            newOrder.line_items.forEach(function (item) {
                var lineItem = {
                    itemId: item.id,
                    itemName: item.name,
                    qty: (item.quantity).toString(),
                    itemPrice: item.price.formatted_with_symbol,
                    lineItemPrice: item.line_total.formatted_with_symbol
                };
                lineItems.push(lineItem);
            });
            shoppingData.lineItems = lineItems.slice();

            console.log(shoppingData);

            commerceJsWebApi.getShoppingConfirmation(shoppingData)
                .then(response => {
                    console.log(response);

                    // this will auto-open-new window in browser
                    // and display file content
                    const type = response.headers['content-type'];
                    const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);


                    // this will auto-download file in browser
                    /*
                    const type = response.headers['content-type'];
                    const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = '__confirmation__.pdf';
                    link.click();
                    */

                    refreshCart();

                })
                .catch(e => {
                    console.log(e);
                });

            // const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            // console.log(incomingOrder);

            // setOrder(incomingOrder);
            // refreshCart();
        }
        catch (error) {
            // setErrorMessage(error.data.error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

  
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar totalItems={cart.total_items} />
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Products
                                products={products}
                                onAddToCart={handleAddToCart}
                            />
                        }
                    />
                    <Route
                        path='/cart'
                        element={
                            <Cart
                                cart={cart}
                                onUpdateCartQty={handleUpdateCartQty}
                                onRemoveFromCart={handleRemoveFromCart}
                                onEmptyCart={handleEmptyCart}
                            />
                        }
                    />
                    <Route
                        path='/checkout'
                        element={
                            <Checkout
                                cart={cart}
                                order={order}
                                onCaptureCheckout={handleCaptureCheckout}
                                error={errorMessage}
                            />
                        }
                    />

                    <Route
                        path='*'
                        element={
                            <NotFound                                
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App