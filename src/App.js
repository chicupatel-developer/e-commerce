import React, { useState, useEffect } from 'react';

import { Products, Navbar, Cart } from './components';
import { commerce } from './lib/commerce';

import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';

const App = () => {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

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

    // when user update qty of item in cart
    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, { quantity });
        setCart(response.cart);
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    console.log(products);
    console.log(cart);
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
                          />
                      }
                  />
                </Routes>                      
          </div>
      </Router>
  )
}

export default App
