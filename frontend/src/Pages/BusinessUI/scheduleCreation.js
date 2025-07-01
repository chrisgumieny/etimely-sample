import { React, useEffect, useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Axios from "axios";
import Sidebar from "../../Component/businessSidebar";
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import '../../Css/scheduleCreation.css';
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";



  // Success alert function for successful additions, updates and deletions
  const successMessage = (placement, message, length) => {
      Swal.fire({
        position: placement,
        title: 'Success',
        html: message,
        timer: length,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        },
        willClose: () => {
          window.location.reload(true);
        }
      })
  }

  const handleConfirm = async (values, action) => {

    // Use values.staffId to find the staff user in the EMPLOYEES array
    // Then grab the staffRoleId from that staff user
    let employeeObject = EMPLOYEES.filter(employee => employee.staffId === values.staffId);
    values.role = employeeObject[0].staffRoleId;

    // errorStatus tells the system whether there are issues with the submitted data and if the api call can be made
    let errorStatus = false;

    // loopCheck determines if existing shifts need to be checked
    let loopCheck = true;

    // employee full name, availability status, and availability message
    let employeeName = "This employee";
    let unavailable = true;
    let availabilityMessage = "does not have any availabilities <br/> set for this date.";

    // Error message that changes based on the situation
    let message = "Error saving schedule.";
    
    // Check to see if the submitted shift is for a past time
    if (new Date() > values.start)
    {
      errorStatus = true;
      loopCheck = false;

      if (action === "create")
      {
        message = "Cannot schedule a shift for a previous time.";
      }
      else if (action === "edit")
      {
        message = "Cannot edit a shift that has already happened.";
      }
    }
    // Making sure the start and end time are on the same date
    else if (values.start.getDate() !== values.end.getDate() || 
    values.start.getMonth() !== values.end.getMonth() || 
    values.start.getFullYear() !== values.end.getFullYear())
    {
      errorStatus = true;
      loopCheck = false;
      message = "A shift can only be scheduled across one day.";
    }
    
    // Check all existing shifts for duplicates or overlapping data
    if (loopCheck === true)
    {
      for (let i = 0; i < EVENTS.length; i++)
      {
        if (EVENTS[i].staffId === values.staffId && EVENTS[i].event_id !== values.event_id)
        {
          // Checking for duplicate shift
          if (EVENTS[i].start.getTime() === values.start.getTime() && EVENTS[i].end.getTime() === values.end.getTime())
          {
            errorStatus = true;
            message = "Duplicate shift.";
          }
          // Checking for overlapping shifts
          if ((EVENTS[i].start < values.start && EVENTS[i].end > values.start) || 
          (EVENTS[i].start < values.end && EVENTS[i].end > values.end))
          {
            errorStatus = true;
            message = "Cannot schedule an overlapping shift.";
          }
          // Checking for overlapping shifts where either start time or end time is equal 
          if ((EVENTS[i].start > values.start && EVENTS[i].end.getTime() === values.end.getTime()) || 
          (EVENTS[i].start.getTime() === values.start.getTime() && EVENTS[i].end < values.end))
          {
            errorStatus = true;
            message = "Cannot schedule an overlapping shift.";
          }
          // Checking for shifts that overlap both ends of another shift
          if (EVENTS[i].start > values.start && EVENTS[i].end < values.end)
          {
            errorStatus = true;
            message = "Cannot schedule an overlapping shift.";
          }
          // Checking for shifts where start time is after end time
          if (values.start > values.end)
          {
              errorStatus = true;
              message = "Start time is after end time.";
          }
        }
      }
      
      // Find the staff user in the EMPLOYEES array to set the full name for availability alert messages
      EMPLOYEES.forEach((employee) => {
        if (employee.staffId === values.staffId)
        {
          employeeName = employee.staffFirstName + " " + employee.staffLastName;
        }
      })
      const response = await Axios.get(`http://localhost:5001/etimely/availability/getAvailability/${values.staffId}`);

      if (response.data[0] !==  undefined)
      {
        // Loop through each availability, add it to an object, 
        // and then perform availability checks if that availability falls on the same date as the new shift
        for(let i = 0; i < response.data.length; i++){
          const availability = {
            start: new Date(response.data[i].startTime),
            end: new Date(response.data[i].endTime)
          }
  
          // Only performs checks for availabilities that are on the same date as the new shift
          if (availability.start.getMonth() === values.start.getMonth() && 
          availability.start.getDate() === values.start.getDate() && 
          availability.start.getFullYear() === values.start.getFullYear())
          {
            // Checking for availability that's the same start and end time as shift
            if (availability.start.getTime() === values.start.getTime() && availability.end.getTime() === values.end.getTime())
            {
              unavailable = false;
            }
            // Checking for availability that overlaps the new shift
            if ((availability.start < values.start && availability.end > values.start) || 
            (availability.start < values.end && availability.end > values.end))
            {
              unavailable = false;
            }
            // Checking for availability that overlaps the new shift 
            if ((availability.start > values.start && availability.end.getTime() === values.end.getTime()) || 
            (availability.start.getTime() === values.start.getTime() && availability.end < values.end))
            {
              unavailable = false;
            }
            // Checking for availability that overlaps the new shift
            if (availability.start > values.start && availability.end < values.end)
            {
              unavailable = false;
            }
            if (unavailable === true)
            {
              const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];

              // Update availabilityMessage with formatted text of the staff user's availability data for the specific day 
              availabilityMessage = "is only available on "  + monthNames[availability.start.getMonth()] + " " + 
              availability.start.getDate() + " <br/> from " + availability.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " to " + 
              availability.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
          }
        }
      }
    }

    if (action === "edit" && errorStatus === false) 
    {
      const response = await Axios.post(`http://localhost:5001/etimely/schedule/update`, values);
      
      if (response.data.status === 'success') {
        return new Promise(() => {
          setTimeout(() => {
          }, 500);
          // Call success alert function with parameters
          successMessage('center-end', 'Shift has been saved.', 2000);
        });
      }
      else 
      {
        // Error message if the api call fails
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save schedule.',
        confirmButtonColor: "#0077ff",
        willClose: () => {
          window.location.reload()
          }
        })
      }
    } 
    else if (action === "create" && errorStatus === false) 
    {
      if (unavailable === true)
      { 
        // Confirmation message for if employee is unavailable for that time
        Swal.fire({
          title: 'Are you sure?',
          html: employeeName + " " + availabilityMessage,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Schedule anyway',
          confirmButtonColor: "#0077ff",
          cancelButtonText: 'Cancel',
          cancelButtonColor: "#9e9e9e"
        }).then((result) => {
          if (result.isConfirmed) {
                handleCreate(values);
          } else 
          {
            window.location.reload();
          }
        })
      }
      else
      {
        handleCreate(values);
      }
    }
    else {
      // Schedule alerts that are shown if the system cannot continue with saving the data to the database
      // This can be due to overlapping or duplicate data, as well as other invalid submissions
      if (action === "create")
      {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          confirmButtonColor: "#0077ff",
          willClose: () => {
            window.location.reload()
            }
          })
      }
      else
      {
        Swal.fire({
          position: 'center-end',
          icon: 'error',
          title: 'Error',
          text: message,
          showConfirmButton: false,
          timer: 2000
        })
      }
    }
  };

  const handleCreate = async (values) => {

    const response = await Axios.post(`http://localhost:5001/etimely/schedule/add`, values);

    if (response.data.status === 'success') 
    {
      return new Promise(() => {
        setTimeout(() => {
        }, 500);
        // Call success alert function with parameters
        successMessage('center', 'Shift has been added.', 2000);
      });
    }
    else 
    {
      // Error message if the api call fails
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save schedule.',
      confirmButtonColor: "#0077ff",
      willClose: () => {
        window.location.reload()
        }
      })
    }
  };
  
  // Error alert that shows up if the business user attempts to drag a shift
  const onEventDrop = () => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Events are not draggable.',
      confirmButtonColor: "#0077ff",
    })
  };


  const handleDelete = async (deletedId) => {
 
    await Axios.delete(`http://localhost:5001/etimely/schedule/${deletedId}`);
    return new Promise(() => {
        setTimeout(() => {
        }, 500);
        // Call success alert function with parameters
        successMessage('center', 'Shift has been deleted.', 2000);
      });
  };

  // Scheduled shifts, employees, and roles under the business
  const EVENTS = [];
  const EMPLOYEES = [];
  const ROLES = [];
  // Predefined colors for the schedule UI
  const COLORS = ["#ab2d2d", "#c9970a", "#0062ff", "#58ab2d", "#a001a2", "#08c5bd", "#6309d9","#c59212"];

  function ScheduleCreation() {

      const [isLoading, setIsLoading] = useState(false);

      // Fetches shift data based on staffId
      const fetchRemoteData = async (id, firstName, lastName) => {
        
        const staffResponse = await Axios.get(`http://localhost:5001/etimely/schedule/getSchedulesByStaffId/${id}`);
        setIsLoading(true);
          // If there are shifts for this staff user, put it into a shift object and push it to the EVENTS array
          // The title field displays the staff user's name on the shift in the schedule UI
          if (staffResponse.data[0] !== undefined) {
              for (let i = 0; i < staffResponse.data.length; i++)
              {
                  const shift = {
                    start: new Date(staffResponse.data[i].start), 
                    end: new Date(staffResponse.data[i].end), 
                    role: staffResponse.data[i].roleName,
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
      
      if (isBusinessLoggedIn()) {
      const user = localStorage.getItem('Business user');
      const companyid = JSON.parse(user).companyId;

      // Grab all of the roles associated with the business
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
                // Create a role object for each role and push it to the ROLES array
                // A color is assigned to each role for the schedule UI
                const role = {
                  role: data.role,
                  roleId: data.roleId,
                  color:  COLORS[colorTracker]
                };
                // Cycle through the COLORS array to assign each role a different color
                // Go back to the start of the COLORS array if the end is reached
                if (colorTracker === 7)
                  colorTracker = 0;
                else
                  colorTracker++;
                ROLES.push(role);
              })
            })
            .catch(err => console.log(err));
      
      // Get a list of staff users associated with the business
      fetch(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      })
          .then(res => res.json())
          .then(data => {
            data.forEach((data) => {
              // Only allow staff users with activated accounts to be including in scheduling
              // An object is created from active staff user data and is then pushed to the EMPLOYEES array
              if (data.accountStatus === "Active")
              {
                const employee = {
                  staffId: data.staffId,
                  staffFirstName: data.staffFirstName,
                  staffLastName: data.staffLastName,
                  staffRoleName: data.roleName,
                  staffRoleId: data.role
                };
                EMPLOYEES.push(employee);
                // Fetch shift data for each staff user
                fetchRemoteData(data.staffId, data.staffFirstName, data.staffLastName);
              }
            })
          })
          .catch(err => console.log(err));

      }
    }, []);


    return (
      <div>
      {isBusinessLoggedIn() ? (
        
          <Box sx={{ display: 'flex' }}>
            <Sidebar/>
              <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, width: { sm: 'calc(100% - 250px)' } }}>
              <Box>
              <br/>
              <br/>
                <h2>Business Schedule</h2>
                  <p>Create a schedule for your organization</p>
                  </Box>
                <Scheduler
                  view="week"
                  month={null}
                  day={{
                    startHour: 0,
                    endHour: 23,
                    step: 60
                  }}
                  week={{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 0,
                    startHour: 0,
                    endHour: 23,
                    step: 60
                  }}
                  events={EVENTS}
                  resources={ROLES}
                  resourceFields={{
                    idField: "role",
                    textField: "role",
                    avatarField: "role",
                    colorField: "color"
                  }}
                  resourceViewMode="tabs"
                  fields={[
                    {
                      // The title field is purely used for displaying the name on the schedule UI
                      name: "title",
                      type: "hidden",
                      config: { label: "Title", required: false, errMsg: "Select an employee." }
                    },
                    {
                      // Dropdown for staff users that shows each staff user's name and role
                      name: "staffId",
                      type: "select",
                      options: EMPLOYEES.map((employee) => {
                        return {
                          id: employee.staffId,
                          text: `${employee.staffFirstName} ${employee.staffLastName} (${employee.staffRoleName})`,
                          value: employee.staffId,
                        };
                      }),
                      config: { label: "Employee", required: true, errMsg: "Select an employee." }
                    },
                    {
                      // The role field is purely used to send the roleId to the database
                      name: "role",
                      type: "hidden",
                      config: { label: "Role", required: true, errMsg: "Select a role." },
                    }
                  ]}
                  onConfirm={handleConfirm}
                  onDelete={handleDelete}
                  onEventDrop={onEventDrop}
                />
            </Box>
            </Box>
            ) : (
            <NotLoggedIn />
          )} 
          </div>
    );
  }

  export default ScheduleCreation;