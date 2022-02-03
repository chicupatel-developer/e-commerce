import React, { useState, useEffect } from 'react'
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import Confirmation from '../Confirmation';

import { commerce } from '../../../lib/commerce';

import { useNavigate } from "react-router-dom";

const steps = ['Shipping address', 'Payement details'];

const Checkout = ({ cart, onCaptureCheckout, order, error }) => {

    const navigate = useNavigate();

    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    const [checkoutTokenId, setCheckoutTokenId] = useState('');
    const [orderData, setOrderData] = useState({});
    const [grandTotal, setGrandTotal] = useState('');

    /*
    Can't perform a React state update on an unmounted component. 
    This is a no-op, but it indicates a memory leak in your application. 
    To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    */
    const [isSubscribed, setIsSubscribed] = useState(true);

    const generateToken = async () => {
        try {            
            if (cart.line_items.length>0) {
                console.log('generateToken calling from Checkout!!!');
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                if (isSubscribed && token) {
                    setCheckoutToken(token);
                }
                else
                    return null;
            }     
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {     
        
        console.log('Checkout is loading!!');
        
        if (cart.id) {          
            generateToken();
        }
        else {
            console.log('cart is empty!');
            navigate("/");
        }

        return () => {
            console.log('checkout unmount!');
            setIsSubscribed(false);
        }
    }, [cart]);


    const Form = () => (activeStep === 0
        ? <AddressForm nextStep={nextStep} setShippingData={setShippingData} checkoutToken={checkoutToken} test={test} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} test1={test1} />
    )

    const test = (shippingData) => {
        console.log(shippingData);
        setShippingData(shippingData);
        nextStep();
    };

    const test1 = (checkoutTokenId, orderData, grandTotal) => {
        console.log(checkoutTokenId, orderData, grandTotal);
        // setShippingData(shippingData); 
        // for above all 3
        setCheckoutTokenId(checkoutTokenId);
        setOrderData(orderData);
        setGrandTotal(grandTotal);
        nextStep();
    };
 
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper} >
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>
                                    {step}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? 
                        <Confirmation
                            checkoutTokenId={checkoutTokenId}
                            orderData={orderData}
                            grandTotal={grandTotal}
                            onCaptureCheckout={onCaptureCheckout} /> :
                        checkoutToken && <Form />}
                </Paper>

            </main>

        </>
    )
}

export default Checkout