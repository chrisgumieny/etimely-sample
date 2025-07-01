import React from 'react'
import Box from '@mui/material/Box';
import Sidebar from '../../Component/staffSidebar';
import "../../Css/announcement.css"
import {isStaffLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";
import StaffGroupChat from '../../Component/Messaging/staffGroupChat';

export default function StaffMessageBoard() {
  return (
    <div>
        {isStaffLoggedIn() ? (
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
                            <StaffGroupChat />
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
