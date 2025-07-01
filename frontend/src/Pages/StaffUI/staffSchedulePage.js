import { React, useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { Scheduler } from "@aldabil/react-scheduler";
import Axios from "axios";
import Box from '@mui/material/Box';
import Sidebar from "../../Component/staffSidebar";
import styled from 'styled-components';
import {isStaffLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";

    // Stopping the user from being able to click their shifts
    const StaffScheduleStyles = styled.div`
    .css-10d1a0h-MuiButtonBase-root
    {
        pointer-events: none !important;
    }
    `;

  

  // Scheduled events
  const EVENTS = [];

  function StaffSchedule() {

    const [isLoading, setIsLoading] = useState(false);

      const fetchEmployeeSchedule = async (staffId, roleId, companyId) => {
          
        const staffResponse = await Axios.get(`http://localhost:5001/etimely/schedule/getSchedulesByStaffId/${staffId}`);

        setIsLoading(true);
        // Push the data for each shift into the EVENTS array
        if (staffResponse.data[0] !== undefined) {
            for (let i = 0; i < staffResponse.data.length; i++)
            {
                const shift = {
                    start: new Date(staffResponse.data[i].start),
                    end: new Date(staffResponse.data[i].end),
                    title: staffResponse.data[i].roleName,
                    staffId: staffId,
                    id: staffResponse.data[i].event_id
                };
                EVENTS.push(shift);
            }
        }
        setIsLoading(false);
      };

    useEffect(() => {
        // If the user is logged in, grab data from local storage 
        // and use that data to fetch the employee's schedule
        if (isStaffLoggedIn()) {
            const user = localStorage.getItem('Staff user');
            const companyId = JSON.parse(user).companyId;
            const staffId = JSON.parse(user).staffId;
            const roleId = JSON.parse(user).roleId;
            fetchEmployeeSchedule(staffId, roleId, companyId);
        }
    }, []);


    return (
      <div>
      {isStaffLoggedIn() ? (
          <StaffScheduleStyles>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, width: { sm: 'calc(100% - 250px)' } }}> 
                <br /><br />
                    <h2>Staff Schedule</h2>
                        <p>View the schedule for your organization</p>
                    <Scheduler
                    view="week"
                    month={null}
                    day={{
                        startHour: 0,
                        endHour: 23,
                        step: 60,
                        // Render each cell in the schedule as grey and unable to be clicked
                        cellRenderer: ({ start, onClick }) => {
                            const hour = start.getHours() + 1;
                            const disabled = hour;
                            return (
                            <Button
                                style={{
                                    border: "1px solid lightgrey",
                                    height: "100%",
                                    background: "#eee"
                                }}
                                onClick={() => {
                                    if (disabled) {
                                        return;
                                    }
                                    onClick();
                                }}
                                disabled={disabled}
                            ></Button>
                            );
                        }
                    }}
                    week={{
                        weekDays: [0, 1, 2, 3, 4, 5, 6],
                        weekStartOn: 0,
                        startHour: 0,
                        endHour: 23,
                        step: 60,
                        // Render each cell in the schedule as grey and unable to be clicked
                        cellRenderer: ({ start, onClick }) => {
                            const hour = start.getHours() + 1;
                            const disabled = hour;
                            return (
                            <Button
                                style={{
                                    border: "1px solid lightgrey",
                                height: "100%",
                                background: "#eee"
                                }}
                                onClick={() => {
                                    if (disabled) {
                                        return;
                                    }
                                    onClick();
                                }}
                                disabled={disabled}
                            ></Button>
                            );
                        }
                    }}
                    events={EVENTS}
                    />
            </Box>
        </Box>
        </StaffScheduleStyles>
        ) : (
            <NotLoggedIn />
      )} 
      </div>
    );
  }

  export default StaffSchedule;