import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, TextField } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { commerce } from '../../lib/commerce';
import FormInput from './CustomTextField';

import useStyles from './styles';
const AddressForm = ({ checkoutToken, test }) => {

    const classes = useStyles();
    
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');   
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [isError, setIsError] = useState({ firstName: undefined, lastName: undefined, city: undefined, zip: undefined, email: undefined, address1: undefined});

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
    
    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

        console.log(countries);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    };
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, []);

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    };
    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry]);

    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

        setShippingOptions(options);
        setShippingOption(options[0].id);
    };
    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision]);


    const handleFormControlChangeEvent = (event) => {
        if (event.target.name === 'firstName') {
            setFirstName(event.target.value);
            if (event.target.value === '') {
                setIsError({
                    ...isError, firstName: "First Name Is Required!"
                });
            }
            else {
                setIsError({
                    ...isError, firstName: ''
                });
            }
        }
        else if (event.target.name === 'lastName') {
            setLastName(event.target.value);
            if (event.target.value === '') {
                setIsError({
                    ...isError, lastName: "Last Name Is Required!"
                });
            }
            else {
                setIsError({
                    ...isError, lastName: ''
                });
            }
        }
        else if (event.target.name === 'address1') {
            setAddress1(event.target.value);
            if (event.target.value === '') {
                setIsError({
                    ...isError, address1: "Address Is Required!"
                });
            }
            else {
                setIsError({
                    ...isError, address1: ''
                });
            }
        }
        else if (event.target.name === 'city') {
            setCity(event.target.value);
            if (event.target.value === '') {
                setIsError({
                    ...isError, city: "City Is Required!"
                });
            }
            else {
                setIsError({
                    ...isError, city: ''
                });
            }
        }
        else if (event.target.name === 'zip') {
            setZip(event.target.value);
            if (event.target.value === '') {
                setIsError({
                    ...isError, zip: "Zip Is Required!"
                });
            }
            else {
                setIsError({
                    ...isError, zip: ''
                });
            }
        }
        else if (event.target.name === 'email') {
            setEmail(event.target.value);
            if (event.target.value === '') {
                setIsError({
                    ...isError, email: "Email Is Required!"
                });
            }
            else {
                setIsError({
                    ...isError, email: ''
                });
            }
        }
    }  
    
    const formValid = (isError) => {
        let isValid = false;
        var BreakException = {};
        try {
            Object.values(isError).forEach(val => {
                console.log('checking... ' + val);
                if (val.length > 0) {
                    isValid = false
                    throw BreakException;
                } else {
                    isValid = true
                }
            });
        } catch (e) {
            return isValid;
        }
        return isValid;
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();        
        console.log('submit!');

        if (formValid(isError)) {
        } else {
            console.log("Form is invalid!");
            return;
        }

        let shippingData = {
            firstName: firstName,
            lastName: lastName,
            address1: address1,
            email: email,
            city: city,
            zip: zip,
            shippingCountry: shippingCountry,
            shippingSubdivision: shippingSubdivision,
            shippingOption: shippingOption
        };
        test(shippingData);
    }
    
    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping address</Typography>
            
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3} >
                    
                        <Grid item xs={12} sm={6}>
                        <TextField
                                name='firstName'
                                fullWidth
                                label="First Name"
                                value={firstName}
                                onChange={e => handleFormControlChangeEvent(e)}
                        />
                        <span className={classes.controlInvalid}>
                            {isError.firstName && (
                                <span className="invalid-feedback">{isError.firstName}</span>
                            )}
                        </span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='lastName'
                                fullWidth
                                label="Last Name"
                                value={lastName}
                                onChange={e => handleFormControlChangeEvent(e)}
                            />
                        <span className={classes.controlInvalid}>
                            {isError.lastName && (
                                <span className="invalid-feedback">{isError.lastName}</span>
                            )}
                        </span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            name='address1'
                                fullWidth
                                label="Address"
                                value={address1}
                            onChange={e => handleFormControlChangeEvent(e)}
                            />
                        <span className={classes.controlInvalid}>
                            {isError.address1 && (
                                <span className="invalid-feedback">{isError.address1}</span>
                            )}
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name='email'
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={e => handleFormControlChangeEvent(e)}
                        />
                        <span className={classes.controlInvalid}>
                            {isError.email && (
                                <span className="invalid-feedback">{isError.email}</span>
                            )}
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name='city'
                            fullWidth
                            label="City"
                            value={city}
                            onChange={e => handleFormControlChangeEvent(e)}
                        />
                        <span className={classes.controlInvalid}>
                            {isError.city && (
                                <span className="invalid-feedback">{isError.city}</span>
                            )}
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        name='zip'
                            fullWidth
                            label="Zip"
                            value={zip}
                            onChange={e => handleFormControlChangeEvent(e)}
                        />
                        <span className={classes.controlInvalid}>
                            {isError.zip && (
                                <span className="invalid-feedback">{isError.zip}</span>
                            )}
                        </span>
                    </Grid>
                      
                   
                      
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>  
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
        </>
    )
}

export default AddressForm;
