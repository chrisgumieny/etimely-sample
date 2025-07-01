import React from 'react'
import Box from '@mui/material/Box';
import Sidebar from '../../Component/businessSidebar';
import "../../Css/announcement.css"
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";
import BusinessGroupChat from '../../Component/Messaging/businessGroupChat';


export default function BusinessMessageBoard() {
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
                <h2>Message Board</h2>
                <p>Send Messages to everyone in your organization</p>
                <br />

                {/* Messages are shown here:  */}
                <BusinessGroupChat />
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
