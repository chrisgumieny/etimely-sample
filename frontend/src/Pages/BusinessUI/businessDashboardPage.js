import { useEffect, useState } from "react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import '../../Css/businessDashboard.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from "../../Component/businessSidebar";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import Axios from "axios";
import { Formik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";


// DECLARE GLOBAL CONSTS/VARIABLES
const TODAY = new Date();  // current date
const UPCOMING = [];
const ROLES = [];
const AVAILABILITIES = [];
const NAMES = [];

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];


// Function to check if the user is logged in using JWT token and local storage
const isLoggedIn = () => {
    const token = localStorage.getItem('Business token');

    if (token === null) {
        return false;

    } else {
        return true;
    }
}

function RequestRow(props) {

    if (NAMES.length !== 0) {
        var availArray = props.availIn;

        return (
            <>
                {NAMES.map(data => {
                    return (
                        <RequestRowHelper
                            namesIn={data}
                            availIn={availArray}
                        />
                    );
                })}
            </>
        );
    }
    else {
        return (
            <React.Fragment>
                <Grid container spacing={0} xl={12} className='current-row-header'>
                    <Box>
                        <p>Nothing to see here...</p>
                    </Box>
                </Grid>
            </React.Fragment>
        );
    }

}

function RequestRowHelper(props) {
    /* UPDATE TO LOOP THRU AND REPEAT FOR EACH REQUEST IN DATABASE
       ALSO MAKE SURE TO PULL NAME AND REQUEST INFO FROM DATABASE */
    const namesIn = props.namesIn;
    const availIn = props.availIn;

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };


    var id = []
    var availString = (availIn.map(availData => {
        var avail = [];


        if (availData.name === namesIn) {
            avail.push(monthNames[availData.start.getMonth()] + ' ' + availData.start.getDate() + dateSuffix(availData.start.getDate()) + ': ' + availData.start.toLocaleTimeString([],
                { hour: '2-digit', minute: '2-digit' }) + ' to ' + availData.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            id.push(availData.id);
        }
        return (avail);
    }))

    return (
        <React.Fragment>
            <Grid container spacing={0} xl={12} className='approval-row'>
                <Box >
                    <p className="update-name">{namesIn}</p>
                </Box>
                <Box className='update-button'>

                    <Button onClick={handleClickOpen} >
                        View
                    </Button>
                    <SimpleDialog
                        selectedValue={selectedValue}
                        open={open}
                        onClose={handleClose}
                        availIn={availString}
                        namesIn={namesIn}
                        id={id}
                    />
                </Box>
            </Grid>
        </React.Fragment>
    );
}

// ===================== DIALOG BOXES FOR NOTIFS =====================

function SimpleDialog(props) {
    const { onClose, selectedValue, open, availIn, namesIn, id } = props;

    // when user closes the dialog box, update the isVerified in database
    const handleClose = async () => {
        onClose(selectedValue);

        for (let i = 0; i < id.length; i++) {
            var availabilityId = id[i];

            const response = await Axios.put(`http://localhost:5001/etimely/availability/verifyAvailability/${availabilityId}`);

            if (response.data.status === 'success') {
                console.log('verified')
            }
            else {
                console.log('failed')
            }
        }
    };

    // render actual dialog box
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{namesIn} updated their availability to:</DialogTitle>
            <DialogContent>
                <DialogContentText>

                    {availIn.map(data => {
                        if (data != '') {
                            return (
                                <p>{data}<br /></p>
                            );
                        }
                    })
                    }

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Okay!</Button>
            </DialogActions>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};


// ============================== FUNCTIONS TO DISPLAY WHO IS CURRENTLY SCHEDULED =============================== 
function ScheduledRow(props) {
    // if there information in ROLES, that means there are active shift to show...

    // return list of people current scheduled, assuming there is anyone scheduled..
    if (ROLES.length !== 0) {
        var shiftArray = props.shiftsIn;
        return (
            <>
                {// map thru ROLES to show the list of staff members scheduled with that role
                    ROLES.map(data => {
                    return (
                        <ScheduledRowHelper
                            rolesIn={data}
                            namesIn={shiftArray}
                        />
                    );
                })}
            </>
        );
    }

    //... Otherwise, alert user that no one is no active shifts
    else {

        return (
            <>
                <React.Fragment>
                    <Grid container spacing={0} xl={12} className='current-row-header'>
                        <Box>
                            <p>Nothing to see here...</p>
                        </Box>
                    </Grid>
                </React.Fragment>

            </>

        );
    }
}

// function to create string with list of all staff members scheduled based on role
// called is ScheduledRow
function ScheduledRowHelper({ rolesIn, namesIn }) {

    var names = '';
    namesIn.map(nameData => {

        if (nameData.role === rolesIn) {
            names = names.concat(' ' + nameData.name.toString() + ',');
        }
        return (names);
    })

    names = names.slice(0, -1);

    return (
        <>
            <>
                <Grid container spacing={0} xl={12} className='current-row-header'>
                    <h4 className="role-name">{rolesIn} </h4>
                    <p className="current-staff">{names}</p>
                </Grid>
            </>
        </>

    );
}



// ====================== USED TO SORT JSON OBJECTS BASED ON START FIELD =========================
function sortJsonByStart(a, b) {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
}

// adds proper suffix to a number (ie 1 => st, 2 => nd, 3 => rd, 4 => th, etc)
function dateSuffix(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

// ============================== MAIN ===============================

export default function BusinessDashboard() {
    const navigate = useNavigate();

    // BEGIN DATA FETCHING 
    const [isLoading, setIsLoading] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [newAvailabilityList, setNewAvailabilityList] = useState([]);

    // creates an array of active shift objects
    const fetchActiveShifts = async (id, firstName, lastName) => {

        const staffResponse = await Axios.get(`http://localhost:5001/etimely/schedule/getSchedulesByStaffId/${id}`);

        setIsLoading(true);
        if (staffResponse.data[0] !== undefined) {
            staffResponse.data.sort(sortJsonByStart);

            for (let i = 0; i < staffResponse.data.length; i++) {
                // validate that we are only using data for active shifts
                if ((Date.parse(staffResponse.data[i].start) <= TODAY) && (Date.parse(staffResponse.data[i].end) >= TODAY)) {

                    // create object with info from database
                    const shift = {
                        role: staffResponse.data[i].roleName,
                        name: firstName + " " + lastName,
                        start: new Date(staffResponse.data[i].start),
                        end: new Date(staffResponse.data[i].end)
                    };

                    // used later to determine which names to list with what role
                    if (!ROLES.includes(staffResponse.data[i].roleName)) {
                        ROLES.push(staffResponse.data[i].roleName);

                    }
                    UPCOMING.push(shift);

                }
            }
        }
        setIsLoading(false);
    };

    // makes an array of new availability objects
    const fetchNewAvailabilities = async (id, firstName, lastName) => {

        const staffResponse = await Axios.get(`http://localhost:5001/etimely/availability/getAvailability/${id}`);

        setIsLoading(true);
        if (staffResponse.data[0] !== undefined) {
            staffResponse.data.sort(sortJsonByStart);
            for (let i = 0; i < staffResponse.data.length; i++) {

                // only use availabilities that ahve not been approved
                if (staffResponse.data[i].isApproved === false) {
                    const availability = {
                        id: staffResponse.data[i].event_id,
                        name: firstName + " " + lastName,
                        start: new Date(staffResponse.data[i].startTime),
                        end: new Date(staffResponse.data[i].endTime)
                    };

                    if (!NAMES.includes(firstName + " " + lastName)) {
                        NAMES.push(firstName + " " + lastName);
                    }
                    AVAILABILITIES.push(availability);
                }
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {

        if (isBusinessLoggedIn()) {
            const user = localStorage.getItem('Business user');
            const companyid = JSON.parse(user).companyId;



            // GET SHIFT INFO
            fetch(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    setEmployeeList(data);
                    data.forEach((data) => {
                        fetchActiveShifts(data.staffId, data.staffFirstName, data.staffLastName);
                    })
                })
                .catch(err => console.log(err));

            // GET AVAILABILITY INFO
            fetch(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {

                    setNewAvailabilityList(data);
                    data.forEach((data) => {
                        fetchNewAvailabilities(data.staffId, data.staffFirstName, data.staffLastName);
                    })
                })
                .catch(err => console.log(err));
        }
    }, []);


    // FOR ANNOUCEMENT
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


    const handleSubmit = async (values) => {
        const user = localStorage.getItem('Business user');
        const companyid = JSON.parse(user).companyId;

        const response = await Axios.post(`http://localhost:5001/etimely/announcement/addAnnouncement/${companyid}`, values);
        
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

    // DISPLAY TO SCREEN
    return (
        <div>
            {isLoggedIn() ? (
                <>
                    <Box sx={{ display: 'flex' }}>
                        <Sidebar />
                        <Box component="main" sx={{ flexGrow: 1, p: 3, pl: 4, pr: 2, pt: 5, width: { sm: `calc(100% - 250px)` } }} className='business-dash'>
                            <Box>
                                <br /><br />
                                <h2>Business Dashboard</h2>
                                <p>See latest activity going on in your organization</p><br />

                            </Box>
                            <Grid container spacing={2} className='business-announce-bar'>

                                <Box className='business-dash-announcement'>
                                    <h3>Make an Announcement</h3>
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

                                                <Form.Group>
                                                    <Form.Control
                                                        autoComplete="off"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.title}
                                                        as="textarea"
                                                        name="title"
                                                        rows="1"
                                                        type="text"
                                                        placeholder="Title"

                                                        isValid={touched.title && !errors.title}
                                                        isInvalid={!!errors.title}
                                                    />
                                                    {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}


                                                    <br />
                                                    <Form.Control
                                                        autoComplete="off"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.details}
                                                        as="textarea"
                                                        rows="3"
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
                                </Box>


                            </Grid>

                            <Grid container spacing={2} xl={3} className='business-dash-approval'>

                                <h3>Updates and Alerts</h3>
                                <br />
                                <br />
                                <RequestRow availIn={AVAILABILITIES} />
                                <br />

                            </Grid>
                            <Grid container spacing={2} xl={8} className='business-dash-current'>
                                <h3>Who is at work right now?</h3>
                                <ScheduledRow shiftsIn={UPCOMING} />
                            </Grid>
                        </Box>
                    </Box>
                </>
            ) : (
                <NotLoggedIn />
            )
            }
        </div>
    );
}