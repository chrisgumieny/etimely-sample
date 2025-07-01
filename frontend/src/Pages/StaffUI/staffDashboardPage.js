import { useEffect, useState } from "react";
import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from '../../Component/staffSidebar';
import '../../Css/staffDashboard.css';
import Axios from "axios";
import {isStaffLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";


// DECLARE GLOBAL CONSTS/VARIABLES
const TODAY = new Date();  // current date
var UPCOMING = [];   // all upcoming shifts (besides next)
var NEXT_SHIFT = []; // staff users next shift
var latestAnnouncement = ''; // will hold the info recieved from database about newest announcement

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];  // used in various functions to get month from Date obj


// Function to show most recent announcemnt
function Announcements() {
    const createdAt = new Date(latestAnnouncement.createdAt);
    const title = latestAnnouncement.title;
    const details = latestAnnouncement.details;
    if (latestAnnouncement === '') {
        return (
            <React.Fragment>

                <h4>
                    Latest Announcement
                </h4>
                <Grid container spacing={0} className='staff-notif-row'>
                    <Box>
                        <p align='left'>
                            Your employer hasn't made any announcements yet!
                        </p>
                    </Box>

                </Grid>

            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment>
                <h4>
                    Latest Announcement
                </h4>

                <Grid container spacing={0} className='staff-notif-row'>
                    <Box>
                        <p align='left'>
                            <strong>{createdAt.toLocaleDateString() + ' ' +
                                createdAt.toLocaleTimeString([],
                                    { hour: '2-digit', minute: '2-digit' })}: </strong>
                            {details}
                        </p>
                    </Box>

                </Grid>


            </React.Fragment>
        );
    }
}

function ShowNextShift(props) {
    if (props.date.length !== 0) {
        var sortedShifts = props.date;

        return (
            <>
                {sortedShifts.map(data => {
                    return (
                        <ShowNextShiftHelper
                            start={data.start}
                            end={data.end}
                        />
                    );
                })}
            </>
        );
    }

    else {
        return (
            <React.Fragment>
                <Box className='staff-nextshift-items'>
                    <Box className='staff-column'>
                        <h3>Currently not scheduled for any shifts</h3>
                    </Box>
                </Box>
            </React.Fragment>
        );
    }
};


function ShowNextShiftHelper({ start, end }) {

    var shiftStart = new Date(start);
    var shiftEnd = new Date(end);



    return (
        <React.Fragment>
            <Box className='staff-nextshift-items'>
                <Box className='staff-column'>
                    <h3>Your next</h3>
                    <h3>shift is at</h3>
                </Box>

            </Box>
            <Box className='staff-nextshift-items'>
                <Box className='staff-column'>
                    <h3>{monthNames[shiftStart.getMonth()]}</h3>
                    <h1>{shiftStart.getDate()}<sup>{dateSuffix(shiftStart.getDate())}</sup></h1>
                </Box>
            </Box>
            <Box className='staff-nextshift-items'>
                <Box className='staff-column'>
                    <h4>{shiftStart.toLocaleTimeString()}</h4>
                    <h5 color='blue'>to</h5>
                    <h4>{shiftEnd.toLocaleTimeString()}</h4>
                </Box>
            </Box>
        </React.Fragment>
    );

}

// renders the upcoming shifts box on screen
function UpcomingShifts(props) {
    // show shifts if there are any retrieved from database
    if (props.date.length !== 0) {
        var sortedShifts = props.date;
        return (
            <>
                {// map thru all shifts to write them to screen
                    sortedShifts.map(data => {
                    return (
                        <UpcomingShiftsHelper
                            start={data.start}
                        />
                    );
                })}
            </>
        );
    }
    
    // handle when there are now shifts
    else {
        return (
            <React.Fragment>

                <Box>
                    <p>Looks like you have some free time...</p>
                </Box>

            </React.Fragment>
        );
    }
}

// renders each shift on screen on a seperate line
function UpcomingShiftsHelper({ start }) {
    var shiftStart = new Date(start);

    return (
        <React.Fragment>
            <Grid container spacing={0} className='approval-row'>
                <Box>
                    <p>{monthNames[shiftStart.getMonth()]} {shiftStart.getDate()}<sup>{dateSuffix(shiftStart.getDate())}</sup></p>
                </Box>
            </Grid>
        </React.Fragment>
    );
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

// used to sort incoming shift info by start, in descending order
function sortJsonByStart(a, b) {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
}

// used to sort incoming announcements by date, in descending order
function sortJsonByCreatedAt(a, b) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}


// MAIN FUNCTION SHOWING THE PAGE
export default function StaffDashboard() {
    const [isLoading, setIsLoading] = useState(false);

    // function to get info about signed in staff users shift info
    const fetchEmployeeSchedule = async (staffId) => {
        // get all of staff user's shifts
        const staffResponse = await Axios.get(`http://localhost:5001/etimely/schedule/getSchedulesByStaffId/${staffId}`);
        var isFirst = true;

        setIsLoading(true);
        
        // if there was info to get from the database, began sorting and storing
        if (staffResponse.data[0] !== undefined) {
            staffResponse.data.sort(sortJsonByStart);

            // only process the next 
            for (let i = 0; i < 6 && i < staffResponse.data.length; i++) {

                if (Date.parse(staffResponse.data[i].start) > TODAY) {
                    const shift = {
                        start: new Date(staffResponse.data[i].start),
                        end: new Date(staffResponse.data[i].end),
                        title: staffResponse.data[i].roleName,
                        staffId: staffId,
                        id: staffResponse.data[i].event_id
                    };

                    
                    // the first shift should be saved in seperate variable to show in "Next shift" area
                    if (isFirst) {
                        NEXT_SHIFT.push(shift);
                        isFirst = false;
                    }
                    // everyhthing else is put into array UPCOMING
                    else {
                        UPCOMING.push(shift);
                    }
                }
            }
        }
        setIsLoading(false);
    };

    // function to put the newest announcement into latestAnnouncement
    const fetchLatestAnnouncement = async (companyId) => {
        // get all announcements, then sort in descending order
        const response = await Axios.get(`http://localhost:5001/etimely/announcement/getAnnouncement/${companyId}`);
        response.data.sort(sortJsonByCreatedAt);


        setIsLoading(true);
        // if there were any announcements retrieved from database, place the newest one into latestAnnoucement
        if (response.data[0] !== undefined) {
            latestAnnouncement = {
                createdAt: new Date(response.data[0].createdAt),
                details: response.data[0].details,
                title: response.data[0].title,
            };

        }
        setIsLoading(false);
    };

    // if user is signed in, get info from local storage and call fetch functions
    useEffect(() => {
        if (isStaffLoggedIn()) {
            const user = localStorage.getItem('Staff user');
            const staffId = JSON.parse(user).staffId;
            const companyId = JSON.parse(user).companyId;
            fetchEmployeeSchedule(staffId);
            fetchLatestAnnouncement(companyId);
        }
    }, []);

    return (
        <div>
            {isStaffLoggedIn() ? (
                <>
                    <Box sx={{ display: 'flex' }}>
                        <Sidebar />
                        <Box component="main" sx={{ flexGrow: 1, p: 3, pl: 4, pr: 2, pt: 5, width: { sm: `calc(100% - 250px)` } }} className='staff-dash'>
                            <Box>
                                <br /><br />
                                <h2>Staff Dashboard</h2><br />
                                <p>View upcoming shifts and Announcements</p><br />
                            </Box>
                            <Grid container spacing={2} className='staff-nextshift-bar'>
                                <ShowNextShift date={NEXT_SHIFT} />
                            </Grid>

                            <Grid container spacing={2} xl={3} className='staff-dash-approval'>
                                <h4>Upcoming Work Days</h4>
                                <UpcomingShifts date={UPCOMING} />
                                <br />

                            </Grid>

                            <Grid container spacing={2} xl={8} className='staff-notif-center'>
                                <Grid xl={10}>
                                    <Announcements />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </>
            ) : (
                <NotLoggedIn />
            )}
        </div>
    )
}