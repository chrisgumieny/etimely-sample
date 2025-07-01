import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import StaffAnnouncementCard from '../../Component/staffAnnouncementCard'
import Box from '@mui/material/Box';
import Sidebar from '../../Component/staffSidebar';
import "../../Css/announcement.css"
import { isStaffLoggedIn } from "../../Utils/Auth";
import NotLoggedIn from "../../Pages/ErrorPages/notLoggedIn";


// Function to sort announcements by date created
function sortJson(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export default function StaffAnnouncements() {
  const [announcementsList, setAnnouncementsList] = useState([]);
  const user = localStorage.getItem('Staff user')
  const companyId = JSON.parse(user).companyId

  useEffect(() => {
    fetch(`http://localhost:5001/etimely/announcement/getAnnouncement/${companyId}`)
      .then(res => res.json())
      .then(data => setAnnouncementsList(data))
  }, []);


  announcementsList.sort(sortJson);

  return (
    <div>
      {isStaffLoggedIn() ? (
        <div>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 8, pt: 8, width: { sm: `calc(100% - 250px)` } }}>
              <div>
                <br />
                <br />
                <h2>View Announcements</h2>
                <p>See all announcements</p>
                <br />

                <div>

                  <Grid container spacing={5}>
                    {(announcementsList.length !== 0) ? (


                      announcementsList.map(response => (

                        <Grid item key={response.id} className="announcementGrid">
                          <StaffAnnouncementCard response={response} />
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