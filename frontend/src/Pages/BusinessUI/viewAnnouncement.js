import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import AnnouncementCard from '../../Component/announcementCard'
import Box from '@mui/material/Box';
import Sidebar from '../../Component/businessSidebar';
import Swal from 'sweetalert2';
import Axios from "axios";
import "../../Css/announcement.css"
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";



// Sort announcements by date created
function sortJson(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export default function ViewAnnouncements() {
  const [announcementsList, setAnnouncementsList] = useState([]);
  const user = localStorage.getItem('Business user')
  const companyId = JSON.parse(user).companyId

  useEffect(() => {
    fetch(`http://localhost:5001/etimely/announcement/getAnnouncement/${companyId}`)
      .then(res => res.json())
      .then(data => setAnnouncementsList(data))
  }, []);


  // Function to delete announcement
  const handleDelete = async (announcementId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "The announcement will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0077ff',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes, delete it',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        await Axios.delete(`http://localhost:5001/etimely/announcement/deleteAnnouncement/${announcementId}`).then(res => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'The announcement has been deleted.',
            confirmButtonColor: "#0077ff",
          })
        })
        const newAnnouncements = announcementsList.filter(response => response.announcementId != announcementId)
        setAnnouncementsList(newAnnouncements)
      }
    })
  }

  announcementsList.sort(sortJson);

  return (
    <div>
      {isBusinessLoggedIn() ? (
        <div>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 8,
                pt: 8,
                width: { sm: "calc(100% - 250px)" },
              }}>
              <div>
                <br />
                <br />
                <h2>View Announcements</h2>
                <p>Manage and view all announcements</p>
                <br />

                <div>
                  <Grid container spacing={5}>
                    {(announcementsList.length !== 0) ? (
                      announcementsList.map(response => (

                        <Grid item key={response.id} className="announcementGrid">
                          <AnnouncementCard response={response} handleDelete={handleDelete} />
                        </Grid>
                      ))
                    ) : (
                      <Grid className='nothingToSeeHere'>
                        <br />
                        <br />
                        <p >Nothing to see here</p>
                      </Grid>
                    )}

                  </Grid>
                </div>
              </div>
            </Box>
          </Box>
        </div>

      ) : (
        <NotLoggedIn />
      )}
    </div>
  )
}