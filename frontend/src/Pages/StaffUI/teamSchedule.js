import { React, useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { Scheduler } from "@aldabil/react-scheduler";
import '../../Css/scheduleCreation.css';
import Axios from "axios";
import Sidebar from "../../Component/staffSidebar";
import Box from '@mui/material/Box';
import styled from 'styled-components';
import {isStaffLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";

//This greys out the screen 
const StaffScheduleStyles = styled.div`
    .css-10d1a0h-MuiButtonBase-root
    {
        pointer-events: none !important;
    }
    `;



  // Scheduled events
  const EVENTS = [];
  const EMPLOYEES = [];
  const ROLES = [];
  const COLORS = ["#ab2d2d", "#c9970a", "#0062ff", "#58ab2d", "#a001a2", "#08c5bd", "#6309d9","#c59212"];
  

  function TeamSchedule() {

      // Employee list
      const [isLoading, setIsLoading] = useState(false);
      

      const fetchRemoteData = async (id, firstName, lastName) => {
        
        const staffResponse = await Axios.get(`http://localhost:5001/etimely/schedule/getSchedulesByStaffId/${id}`);
        setIsLoading(true);
          if (staffResponse.data[0] !== undefined) {
              for (let i = 0; i < staffResponse.data.length; i++)
              {
                let staffRole = ROLES.filter(role => role.roleId === staffResponse.data[i].role);
                let roleName = staffRole[0].role;

                  const shift = {
                    start: new Date(staffResponse.data[i].start), 
                    end: new Date(staffResponse.data[i].end), 
                    role: roleName,
                    staffId: id,
                    title: firstName + " " + lastName, 
                    event_id: staffResponse.data[i].event_id
                  };
                  EVENTS.push(shift);
              }
          }
          setIsLoading(false);
      };

    useEffect(() => {
      
      if (isStaffLoggedIn()) {
      const user = localStorage.getItem('Staff user');
      const companyid = JSON.parse(user).companyId;

      fetch(`http://localhost:5001/etimely/role/getRolesByBusinessId/${companyid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
              let colorTracker = 0;
              data.forEach((data) => {
                const role = {
                  role: data.role,
                  roleId: data.roleId,
                  color:  COLORS[colorTracker]
                };
                if (colorTracker === 7)
                  colorTracker = 0;
                else
                  colorTracker++;
                ROLES.push(role);
              })
            })
            .catch(err => console.log(err));
      
      fetch(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      })
          .then(res => res.json())
          .then(data => {
            data.forEach((data) => {
              if (data.accountStatus === "Active")
              {
                const employee = {
                  staffId: data.staffId,
                  staffFirstName: data.staffFirstName,
                  staffLastName: data.staffLastName,
                  staffRole: data.roleId
                };
                EMPLOYEES.push(employee);
                fetchRemoteData(data.staffId, data.staffFirstName, data.staffLastName);
              }
            })
          })
          .catch(err => console.log(err));

      }
    }, []);


    return (
        
      <div>
      {isStaffLoggedIn() ? (
        <StaffScheduleStyles>        
          <Box sx={{ display: 'flex' }}>
            <Sidebar/>
              <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, width: { sm: 'calc(100% - 250px)' } }}>
              <Box>
              <br/>
              <br/>
                <h2>Team Schedule</h2>
                  <p>View your team's schedule</p>
                  </Box>
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
                      );}
                  }}
                  week={{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 0,
                    startHour: 0,
                    endHour: 23,
                    step: 60,
                    //cellrenderer disables users ability to add shifts
                    cellRenderer: ({ height, start, onClick }) => {
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
                  }}
                }             
                  events={EVENTS}
                  resources={ROLES}
                  resourceFields={{
                    idField: "role",
                    textField: "role",
                    avatarField: "role",
                    colorField: "color"
                  }}
                  resourceViewMode="tabs"
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

  export default TeamSchedule;