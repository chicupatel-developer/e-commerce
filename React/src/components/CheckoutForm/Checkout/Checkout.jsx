import React, {useState, useEffect} from 'react'
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';

const steps = ['Shipping address', 'Payement details'];

const Checkout = ({ cart, onCaptureCheckout, order, error}) => {

    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    const generateToken = async () => {
        try {
            const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

            setCheckoutToken(token);
        } catch {

        }
    };
    useEffect(() => {
        if (cart.id) {
            generateToken();
        }
    }, [cart]);

    
    const Form = () => (activeStep === 0
        ? <AddressForm nextStep={nextStep} setShippingData={setShippingData} checkoutToken={checkoutToken} test={test} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} />
    )
       
    const Confirmation = () => (
        <div>
            Confirmation
        </div>
    )

    const test = (shippingData) => {
        console.log(shippingData);
        setShippingData(shippingData);
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
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
              </Paper>

          </main>

        </>
    )
}

export default Checkout
