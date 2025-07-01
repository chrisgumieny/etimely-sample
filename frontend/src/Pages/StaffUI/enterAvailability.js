import React, { useEffect, useState } from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
import Axios from "axios";
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import Sidebar from '../../Component/staffSidebar';
import {isStaffLoggedIn} from '../../Utils/Auth';
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

// add and update availability
const handleConfirm = async (values, action) => {

  // errorStatus tells the system whether there are issues with the submitted data and if the api call can be made
  let errorStatus = false;

  // loopCheck determines if existing availabilities need to be checked
  let loopCheck = true;

  // Error message that changes based on the situation
  let message = "Error saving schedule";
  
  if (isStaffLoggedIn()) {
    const user = localStorage.getItem('Staff user');
    const staffId = JSON.parse(user).staffId;

    // Check to see if the submitted availability is for a past time
    if (new Date() > values.start)
    {
      errorStatus = true;
      loopCheck = false;

      if (action === "create")
      {
        message = "Cannot add an availability for a previous time";
      }
      else if (action === "edit")
      {
        message = "Cannot edit an availability from a previous time";
      }
    }
    // Making sure the start and end time are on the same date
    else if (values.start.getDate() !== values.end.getDate() || 
    values.start.getMonth() !== values.end.getMonth() || 
    values.start.getFullYear() !== values.end.getFullYear())
    {
      errorStatus = true;
      loopCheck = false;
      message = "An availability can only be scheduled across one day.";
    }

    // Check all existing availabilities for duplicates or overlapping data
    if (loopCheck === true)
    {
      for (let i = 0; i < availabilityData.length; i++)
      {
        if (availabilityData[i].event_id !== values.event_id)
        {
          // Checking for duplicate shift
          if (availabilityData[i].start.getTime() === values.start.getTime() && availabilityData[i].end.getTime() === values.end.getTime())
          {
            errorStatus = true;
            message = "Duplicate availability.";
          }
          // Checking for overlapping shifts
          if ((availabilityData[i].start < values.start && availabilityData[i].end > values.start) || 
          (availabilityData[i].start < values.end && availabilityData[i].end > values.end))
          {
            errorStatus = true;
            message = "Availabilities cannot overlap.";
          }
          // Checking for overlapping shifts where either start time or end time is equal 
          if ((availabilityData[i].start > values.start && availabilityData[i].end.getTime() === values.end.getTime()) || 
          (availabilityData[i].start.getTime() === values.start.getTime() && availabilityData[i].end < values.end))
          {
            errorStatus = true;
            message = "Availabilities cannot overlap.";
          }
          // Checking for shifts that overlap both ends of another shift
          if (availabilityData[i].start > values.start && availabilityData[i].end < values.end)
          {
            errorStatus = true;
            message = "Availabilities cannot overlap.";
          }
          // Checking for shifts where start time is after end time
          if (values.start > values.end)
          {
            errorStatus = true;
            message = "Start time is after end time.";
          }
        }
      }
    }

  if (action === "edit" && errorStatus === false) {
    const response = await Axios.post('http://localhost:5001/etimely/availability/updateAvailability', values);

    if(response.data.status==='success')
    {
      return new Promise(()=>{
        setTimeout(()=>{
        }, 500);
        // Call success alert function with parameters
        successMessage('center-end', 'Availability has been saved.', 2000);
      });
    }
    else
    {
      // Error message if the api call fails
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save availability.',
      confirmButtonColor: "#0077ff",
      willClose: ()=>{
        window.location.reload()
        }
      })
    }
  }
  else if (action === "create" && errorStatus === false) 
  {
    const response = await Axios.post(`http://localhost:5001/etimely/availability/add/${staffId}`, values);
    if(response.data.status==='success')
    {
      // Call success alert function with parameters
      successMessage('center', 'Availability has been added.', 2000);
    }
    else
    {
      // Error message if the api call fails
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save availability.',
      confirmButtonColor: "#0077ff",
      willClose: ()=>{
        window.location.reload()
        }
      })
    }
  }
  else
  {
    // Availability alerts that are shown if the system cannot continue with saving the data to the database
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
}};

// delete availability
const handleDelete = async (deletedId) => {
  await Axios.delete(`http://localhost:5001/etimely/availability/${deletedId}`);
  return new Promise((res) => {
    setTimeout(() => {
      res(deletedId);
    }, 500);
    successMessage('center', 'Availability has been deleted.', 2000);
  });
};

const availabilityData = [];

function EnterAvailability() {
   
  useEffect(() => {
    if (isStaffLoggedIn()) {
      const user = localStorage.getItem('Staff user');
      const staffId = JSON.parse(user).staffId;
      
      getAvailabilityByStaffId(staffId);
        
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  // Function to get avaialability
  const getAvailabilityByStaffId = async (staffId) => {
    const response = await Axios.get(`http://localhost:5001/etimely/availability/getAvailability/${staffId}`);
    setIsLoading(true);
      if (response.data[0] !==  undefined)
      {
        
        // Loop through response
        for(let i = 0; i < response.data.length; i++){
          const availability = {
            event_id: response.data[i].event_id,
            start: new Date(response.data[i].startTime),
            end: new Date(response.data[i].endTime)
          }
          availabilityData.push(availability);
        }
        
      }
    setIsLoading(false);
  }
  
  return (
    <div>
      {isStaffLoggedIn() ? (
        <div>
        <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, width: { sm: `calc(100% - 250px)` } }}>
        <br/>
        <br/>
          <h2>Enter Availability</h2>
            <p>Enter and manage the times you are available to work</p>
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
              events={availabilityData}
              fields={[
                {
                  name: "title",
                  type: "hidden",
                  config: { label: "Title", required: false, errMsg: "Select an employee." }
                } 
              ]}
            onConfirm={handleConfirm}
            onDelete={handleDelete}
        />
        </Box>
        </Box>
        </div>
        ) : (
          <NotLoggedIn />
      )} 
      </div>
    );
} 
export default EnterAvailability;