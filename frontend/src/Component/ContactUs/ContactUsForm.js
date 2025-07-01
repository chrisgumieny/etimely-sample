import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import Axios from "axios";
import {
  Button,
  Form,
} from 'react-bootstrap';

const ContactUSFormStyle = styled.form`
  width: 100%;
  .form-group {
    width: 100%;
    margin-bottom: 2rem;
  }
  label {
    font-size: 1.8rem;
    color: #0077ff;
  }
  input,
  textarea {
    width: 100%;
    font-size: 1.8rem;
    padding: 1.2rem;
    color: var(--gray-1);
    background-color: var(--deep-dark);
    outline: none;
    border: none;
    border-radius: 8px;
    margin-top: 1rem;
    border: 1px solid grey;
    height: 50px;
  }
  textarea {
    min-height: 250px;
    resize: vertical;
    border: 1px solid grey;
  }
  
`;

export default function ContactUsForm() {
  
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  const validatationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required'),
    email: Yup.string()
    .required('Company email is required')
    .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        'Invalid email address'
    ),
    message: Yup.string()
      .required('Message is required')
      .min(20, 'Message must be at least 20 characters long')
      .max(255, 'Message must be less than 255 characters long'),
  });


  const onSubmit =  async (values) => {
      
    const response = await Axios.post('http://localhost:5001/etimely/contactUs', values);
    if (response.data.status === 'success') {
      Swal.fire({
        title: 'Success',
        text: 'Your message has been sent.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0077ff',
        // Onlick ok button reload the page
        preConfirm: () => {
          window.location.reload();
        }
        
      });


    }
    else {
      Swal.fire({
        title: 'Error',
        text: 'Failed to send message.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0077ff',
      });
    }
  };



  return (
    <>
        <Formik
          initialValues={initialValues}
          validationSchema={validatationSchema}
          onSubmit={onSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicName">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <br />
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <br />
              <Form.Group controlId="formBasicMessage">
                <Form.Control
                  as="textarea"
                  rows="4"
                  name="message"
                  placeholder="Enter message"
                  value={values.message}
                  onChange={handleChange}
                  isValid={touched.message && !errors.message}
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <br />

              <Button variant="primary" type="submit" 
              >
                Send
              </Button>
            </Form>
          )}

          
        </Formik>
    </>
  );
}