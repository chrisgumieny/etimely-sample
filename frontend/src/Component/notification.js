import React from 'react'
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';


export default function Notification(props) {

    const {notify, setNotify} = props;

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotify({
            ...notify,
            isOpen: false
        });
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={notify.isOpen}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
        >
            <Alert onClose={handleNotificationClose} severity={notify.severity}>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}
