import React, {useEffect} from 'react'
import { Typography, Divider } from '@material-ui/core';
import { useNavigate } from "react-router-dom";

const Confirmation = ({ checkoutTokenId, orderData, grandTotal ,onCaptureCheckout }) => {
    
    const navigate = useNavigate();

    const captureCheckout = () => {
        console.log('Confirmation calling onCaptureCheckout!!');
        onCaptureCheckout(checkoutTokenId, orderData, grandTotal);

        // navigate("/");
    };
    useEffect(() => {
        console.log('Confirmation loading!!');
        captureCheckout();
    }, []);
    
  return (
      <>
          <Typography variant="h5" gutterBottom style={{ margin: '20px 0' }}>
              <b>{orderData.customer.firstname} {orderData.customer.lastname}</b>,
              <br />
              Order Amount of <b>{grandTotal} is Confirmed!!</b>
          </Typography>        
          <Divider />
          <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>                
              Please note your Payment - Confimration :
              <br />
              <b>{orderData.payment.stripe.payment_method_id}</b>
          </Typography>
          <Divider />
          <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>
              Also, your Order - Confirmation is sent to your email
              <br />
              [<b> {orderData.customer.email} </b>]
          </Typography>
      </>
  )
}

export default Confirmation
