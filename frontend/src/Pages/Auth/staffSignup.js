
   
import React from 'react'
import Axios from "axios";
import { useState } from "react"
import {
    Button,
    Form,
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../../Css/signup.css';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Alert } from "react-bootstrap";
import logo from "../../Images/Logo/eTimely-540x200.png";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';


function StaffUserSignup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // Signup form values
    const initialValues = {
        password: '',
        confirmPassword: '',
        TermsAndConditions: false

    }

    // Function to toggle password visibility
    const togglePassword = (e) => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true)
        }
    }

    // Form validation
    const validatationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
            .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
            .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
            .min(8, 'Password must be at least 8 characters'),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),

        // Terms and conditions validation
        TermsAndConditions: Yup.boolean()
            .oneOf([true], 'You must agree to the terms and conditions')

    });


// Submit form data to backend
    const onSubmit = async (values) => {

        const token = window.location.href.split("/")[window.location.href.split("/").length - 1];

        // Send data to backend server
        const response = await Axios.post(`http://localhost:5001/etimely/business/verifyInviteLink/${token}`, values);
        if (response.data.status === 'success') {
            // set a timer to show success message before redirecting to login page
            navigate("/userLogin");
        }

        // If failed, show notification with error message
        else {
            setError(response.data.message)
        }

    }

    return (
        <>
            <div className="row g-0 userLogin-wrapper">
                <div className="col-12 col-md-5 col-lg-6 h-100 userLogin-background-col">
                    <div className="userLogin-background-holder"></div>
                    <div className="userLogin-background-mask"></div>
                </div>


                {/* Show form UI */}
                <div className="col-12 col-md-7 col-lg-6 userLogin-main-col text-center">
                    <div className="d-flex flex-column align-content-end">
                        <div className="userLogin-body mx-auto">
                            <img className="mobile-signup-logo" src={logo} alt="eTimely"></img>
                            <h2>Set your password</h2>
                            <br />
                            <p>Setup a password to access your account</p>
                            <br />
                            <div className="userLogin-form-container text-start">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validatationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                        <Form onSubmit={handleSubmit}>

                                            <div className="password mb-3">
                                                <div className="input-group">
                                                    <input
                                                        autocomplete="off"
                                                        className="form-control"
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        id="password"
                                                        placeholder="Password*"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.password}
                                                    />
                                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={(e) => togglePassword(e)} ><i className={showPassword ? 'far fa-eye' : 'far fa-eye-slash'} ></i> </button>
                                                </div>
                                                {errors.password && touched.password && (
                                                    <div className="text-danger">{errors.password}</div>
                                                )}
                                            </div>
                                            <br></br>
                                            <div className="password mb-3">
                                                <div className="input-group">
                                                    <input
                                                        autocomplete="off"
                                                        className="form-control"
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        placeholder="Confirm password*"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.confirmPassword}
                                                    />
                                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={(e) => togglePassword(e)} ><i className={showPassword ? 'far fa-eye' : 'far fa-eye-slash'} ></i> </button>
                                                </div>
                                                {errors.confirmPassword && touched.confirmPassword && (
                                                    <div className="text-danger">{errors.confirmPassword}</div>
                                                )}
                                            </div>
                                            <br></br>

                                            {/* Terms and conditions Check*/}
                                            <Form.Group controlId="formBasicCheckbox" className='terms-checkbox'>
                                                <Form.Check
                                                    type="checkbox"
                                                    label='I agree to the&nbsp;'
                                                    name="TermsAndConditions"
                                                    id="TermsAndConditions"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.TermsAndConditions}
                                                />
                                                <a href='#' onClick={handleClickOpen}>terms and conditions</a>

                                            </Form.Group>
                                            {errors.TermsAndConditions && touched.TermsAndConditions && (
                                                <div className="text-danger">{errors.TermsAndConditions}</div>
                                            )}
                                            {/* Button to set password */}
                                            <Button className="style" variant="primary" type="submit">
                                                Set my password
                                            </Button>
                                            <br></br>


                                            {/* DIALOG BOX TO SHOW THE TERMS AND CONDITIONS
                                            should only be visible of user clicks on 'terms and conditions*/}

                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                            >
                                                <DialogTitle>
                                                    {"Terms and Conditions"}
                                                </DialogTitle>

                                                <DialogContent>
                                                    <DialogContentText >
                                                        <div align="left">
                                                            eTimely takes pride in providing an open communication platform for your team.
                                                            We want this to be a welcoming and secure environment for users.
                                                            Please review the list of permitted behaviors on this platform.
                                                            Anyone who violates the terms and conditions will have their account banned and they will be removed from the site.
                                                            The following are the application's terms of use:
                                                            <li>Users must be at least 14 years old.</li>
                                                            <li>Users must sign in with their real name.</li>
                                                            <li>Users must provide accurate personal information.</li>
                                                            <li>Users are only permitted to register for one account at a time.</li>
                                                            <li>Users will refrain from using profanity or derogatory language.</li>
                                                            <li>This platform will not be used by users to sell goods or services.</li>
                                                            <li>Users will not use this platform to plan or carry out violent or criminal acts.</li>
                                                            <li>This platform will not be used for political or religious content.</li>
                                                        </div>
                                                    </DialogContentText>
                                                </DialogContent>

                                                <DialogActions>
                                                    <Button onClick={handleClose}>
                                                        Okay!
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>

                                        </Form>
                                    )}
                                </Formik>
                                <h6 className="text-center">Already have an account? <a href="/userLogin">Sign In</a></h6>
                                <br></br>
                                <h6 className="text-center"><a href="/">Home</a></h6>
                                {error && <Alert variant="danger" className="ErrorMessage">{error}</Alert>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StaffUserSignup;