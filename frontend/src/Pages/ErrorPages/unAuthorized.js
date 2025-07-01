import React from 'react'

// Function to display unauthorized error message to user if user tries to access pages that are not authorized
export default function UnAuthorized() {
    return (
        <div>
            <h2>401</h2>
            <h2>Unauthorized</h2>
            <br />
            <h3>You are not authorized to access this page</h3>
        </div>
    )
}