import React from 'react'
import Axios from "axios";
import { useState } from "react"
import { Button,  
    Form, 
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import  '../../Css/changePassword.css'
import { Formik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import logo from "../../Images/Logo/eTimely-540x200.png";


// Function to allow user to change their password
function ChangePassword() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);;

// Function allows user to toggle between showing and hiding password
    const togglePassword = (e) => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true)
        }
    }

// Initial values to grab in the form
    const initialValues = {
        password: '',
        confirmPassword: '',
    }

    // Change Password Form Validation
    const validatationSchema = Yup.object().shape({
        password: Yup.string()
        .required('Password is required')
        .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
        .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
        .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
        .min(8, 'Password must be at least 8 characters'),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    })



// Function to grab the form data and send it to the backend and database and display a success message
    const onSubmit = async (values) => {
        // Get token from url header
        const token = window.location.href.split("/")[window.location.href.split("/").length - 1];

        // Call localhost:5000/etimely/updatePasswordPost/:token
        const response = await Axios.put(`http://localhost:5001/etimely/updatePasswordPost/${token}`, values);
        if (response.status === 200) {
            Swal.fire({
                title: 'Success',
                html: 'Password has been changed. <br>Please login with new password.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0077ff',
            })
            navigate('/userLogin');
        }
        // If the backend returns an error, display an error message
        else {
            Swal.fire({
                title: 'Error',
                text: 'Failed to change password.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0077ff',
            })
        }
    }

    // Return a UI form to allow user to change their password
    return (
        <>
         <div className="row g-0 userLogin-wrapper">
            <div className="col-12 col-md-5 col-lg-6 h-100 userLogin-background-col">
                <div className="userLogin-background-holder"></div>
                <div className="userLogin-background-mask"></div>
            </div>
            <div className="col-12 col-md-7 col-lg-6 userLogin-main-col text-center">
                <div className="d-flex flex-column align-content-end">
                    <div className="userLogin-body mx-auto">
                    <img className="mobile-signup-logo" src={logo} alt="eTimely"></img>
                        <h2>Reset Password</h2>
                        <br />
                    <p>Change your password below</p>
                        <div className="userLogin-form-container text-start">
                        <Formik
                        initialValues={initialValues}
                        validationSchema={validatationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            // Create form for user to change their password
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
                                        {errors.password && touched.password && (
                                            <div className="text-danger">{errors.password}</div>
                                        )}
                                    </div> 
                                <Button className="style" variant="primary" type="submit">
                                Change Password
                            </Button>
                            <br></br>
                            <h6 className="text-center"><a href="/">Home</a></h6>
                            <br></br>
                            </Form>
                        )}
                    </Formik>
                    <br></br>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        
    </>

    )

}




export default ChangePassword;
