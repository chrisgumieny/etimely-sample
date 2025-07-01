import React from 'react'
import Axios from "axios";
import { useState } from "react"
import { Button, 
    Form,  
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../../Css/login.css';
import '../../Css/userLogin.scss';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Alert } from "react-bootstrap"
import Swal from 'sweetalert2';
import logo from "../../Images/Logo/eTimely-540x200.png";



// Function to allow both a business and staff user to login
function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

 // Initial values to grab in the form
    const initialValues = {
        companyEmail: '',
        password: '',    
}

// Function to allow user to toggle between showing and hiding password
const togglePassword = (e) => {
    if (showPassword) {
        setShowPassword(false);
    } else {
        setShowPassword(true)
    }
}


// Staff Signup Form Validation
    const validatationSchema = Yup.object().shape({
        companyEmail: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });


    // Function to validate user login credentials and redirect to dashboard
    const onSubmit = async (values) => {

        const response = await Axios.post('http://localhost:5001/etimely/login', values);
        if (response.data.status === 'success') {


            // Redirect to dashboard page
                // check response data to see if the user is a business or staff
                // if business, redirect to dashboard
                if (response.data.message  === 'Business account logged in successfully') {
                    // Store the token in local storage
                    localStorage.setItem('Business token', response.data.token);

                    // Convert [Object Object] before storing in local storage
                    localStorage.setItem('Business user', JSON.stringify(response.data.user));

                    //localStorage.setItem('Business Type', response.data.user.userType);
                    // Redirect to dashboard page
                    navigate('/Business/Dashboard');
                }

                // If user is a staff, redirect to staff dashboard
                else if (response.data.message  === 'Staff account logged in successfully') {
                    // Store the token in local storage
                    localStorage.setItem('Staff token', response.data.token);

                    // Convert [Object Object] before storing in local storage
                    localStorage.setItem('Staff user', JSON.stringify(response.data.user));
                    // Redirect to dashboard page
                    navigate('/Staff/Dashboard');
                }

                // If user isn't verified, show error alert
                else if (response.data.message === 'Account not verified, please check your email for verification link'){
                    setError("Activation link has been sent to your email. Please check your email to activate your account.");
                    Swal.fire({ 
                        icon: 'error',
                        title: 'Error',
                        html: 'Your account has not been verified. <br>Please check your email to activate your account.',
                        confirmButtonColor: '#0077ff',
                    })
                }
                else {
                    setError(response.data.message)
                }
        }
        else {
            setError(response.data.message)
        } 
    }

 
    // Return a UI form to allow users to enter their login credentials
    return (
        <> 
            <div className="row g-0 userLogin-wrapper">
            <div className="col-12 col-md-5 col-lg-6 h-100 userLogin-background-col">
                <div className="userLogin-background-holder"></div>
                <div className="userLogin-background-mask"></div>
            </div>

            

{/* Form starts here */}
            <div className="col-12 col-md-7 col-lg-6 userLogin-main-col text-center">
                <div className="d-flex flex-column align-content-end">
                    <div className="userLogin-body mx-auto">
                    <img className="mobile-signup-logo" src={logo} alt="eTimely"></img>
                        <h2>Welcome back</h2>
                        <br />
                    <p>Login to your account</p>
                        <div className="userLogin-form-container text-start">
                        <Formik
                                initialValues={initialValues}
                                validationSchema={validatationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group >
                                            <Form.Control
                                                autocomplete="off"
                                                type="text"
                                                name="companyEmail"
                                                id="companyEmail"
                                                placeholder="Email*"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.companyEmail}
                                            />
                                            {errors.companyEmail && touched.companyEmail && (
                                                <div className="text-danger">{errors.companyEmail}</div>
                                            )}
                                        </Form.Group>
                                        <br></br>
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
                                        <div className="extra mt-3 row justify-content-between">
                                        <div className="row align-items-center">
                                        <h6 className="text-center">Forgot Password? <a href="/resetPassword">Reset</a></h6>
                                        </div>
                                        </div>
                                        <Button className="style" variant="primary" type="submit">
                                            Login
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                            <h6 className="text-center">New to eTimely?  <a href="/Business/Signup">Sign Up</a></h6>
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
                    
export default Login;