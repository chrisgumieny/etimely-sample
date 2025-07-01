import React from 'react'
import Axios from "axios";
import { Button, 
    Form} from 'react-bootstrap';
import '../../Css/resetPassword.scss';
import "../../Css/reset.css";
import { Formik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import logo from "../../Images/Logo/eTimely-540x200.png";


function ResetPassword(){
    

    // Reset password form
    const initialValues = {
        companyEmail: '',
    }

    // Form validation
    const validatationSchema = Yup.object().shape({
        companyEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    })

    // onSubmit function to call resetPassword API and get users email and send link to reset password
    const onSubmit = async (values) => {
        
        const response = await Axios.put('http://localhost:5001/etimely/resetPasswordPost', values);
        if(response.data.message === "Email sent successfully"){
            // use sweet alert to show success message
            Swal.fire({
                icon: 'success',
                title: 'Success',
                html: 'An email has been sent to your email account. <br>Please check your email for reset password link.',
                confirmButtonColor: '#0077ff',
            })

        }

        else{
            // use sweet alert to show error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: 'Email address does not exist. <br>Please use a valid email address!',
                confirmButtonColor: '#0077ff',
            })
        }
       

}


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
                    <h2> Reset Password </h2>
                        <br />
                    <p>To reset your password, enter your email address in the field below</p>
                    <br />
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
                                             placeholder="Email"
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             value={values.companyEmail}
                                         />
                                        {errors.companyEmail && touched.companyEmail && (
                                                <div className="text-danger">{errors.companyEmail}</div>
                                            )}
                                     </Form.Group>
                                     <Button className="style" variant="primary" type="submit">
                                     Send Reset Link
                                 </Button>
                                 <br></br>
                                 <h6 className="text-center"><a href="/">Home</a></h6>
                                 <br></br>
                                 </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </>

    )
}


    
export default ResetPassword;