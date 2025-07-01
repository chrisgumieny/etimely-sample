import React from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core'
import Axios from "axios";
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import Sidebar from '../../Component/businessSidebar';
import '../../Css/signup.css';
import { Formik } from 'formik';
import * as Yup from "yup";
import {
    Button,
    Form,
} from 'react-bootstrap';
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";



const useStyles = makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: 'block'
    }
})

export default function CreateAnnouncement() {


    // New Form
    const initialValues = {
        title: '',
        details: ''
    }

    // Validation Schema
    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required')
            // Must be 10 characters or more
            .min(5, 'Title must be at least 5 characters')
            .max(50, 'Title must be at most 50 characters'),
        details: Yup.string()
            .required('Details is required')
            // Must be 10 characters or more
            .min(10, 'Details must be at least 10 characters')
        .max(500, 'Details must be at most 500 characters')
    })



// Submit Form for creating announcement
    const handleSubmit = async (values) => {

        const user = localStorage.getItem('Business user')
    const companyId = JSON.parse(user).companyId

        const response = await Axios.post(`http://localhost:5001/etimely/announcement/addAnnouncement/${companyId}`, values);
        if (response.data.status === 'success') {
            Swal.fire({
                title: 'Success',
                text: 'Announcement has been created.',
                icon: 'success',
                confirmButtonColor: '#0077ff',
                confirmButtonText: 'OK',
                willClose: () => {
                    window.location.reload()
                }
            })
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Failed to create announcement.',
                icon: 'error',
                confirmButtonColor: '#0077ff',
                confirmButtonText: 'OK'
            })
        }
    }


    return (
        <div>
            {isBusinessLoggedIn() ? (
                <div>
                    <Box sx={{ display: 'flex' }}>
                        <Sidebar />
                        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 250px)` } }}>
                            <br />
                            <br />
                            <Container>
                                <br />
                                <br />
                                <h2>Create an Announcement</h2>
                                <p>Create new announcements for your business</p>
                                <br />

                               
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
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
                                        <form onSubmit={handleSubmit}>
                                            <br />
                                            <Form.Group>
                                                <Form.Control
                                                    autoComplete="off"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.title}
                                                    as="textarea"
                                                    name="title"
                                                    rows="2"
                                                    type="text"
                                                    placeholder="Title"
                                                    isValid={touched.title && !errors.title}
                                                    isInvalid={!!errors.title}
                                                />
                                                {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}

                                                <br />
                                                <br />
                                                <Form.Control
                                                    autoComplete="off"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.details}
                                                    as="textarea"
                                                    rows="6"
                                                    name="details"
                                                    type="text"
                                                    placeholder="Details"
                                                    isValid={touched.details && !errors.details}
                                                    isInvalid={!!errors.details}
                                                />
                                                {errors.details && <Form.Control.Feedback type="invalid">{errors.details}</Form.Control.Feedback>}

                                                <br />
                                                <Button variant="primary" type="submit">
                                                    Send
                                                </Button>
                                            </Form.Group>
                                        </form>
                                    )}
                                </Formik>
                            </Container>
                        </Box>
                    </Box>
                </div>

            ) : (
                <NotLoggedIn />
            )}
        </div>
    )
}