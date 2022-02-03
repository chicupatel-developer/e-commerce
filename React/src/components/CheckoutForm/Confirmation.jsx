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
          <Typography variant="h3" gutterBottom style={{ margin: '20px 0' }}>
              Order is Confirmed!!
          </Typography>        
          <Divider />
          <Typography variant="h4" gutterBottom style={{ margin: '20px 0' }}>
              Checkout-Token Id : {checkoutTokenId}
          </Typography>
          <Divider />
          <Typography variant="h4" gutterBottom style={{ margin: '20px 0' }}>
              Total Purchased : {grandTotal}
          </Typography>
      </>
  )
}

export default Confirmation
