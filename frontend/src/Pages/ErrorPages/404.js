import React from 'react'

// Function to display 404 error message to user is page/routes is not found
export default function NotFound() {
    return (
        <div>
            <h2>404</h2>
            <h2>Page not found</h2>

            {/* Please click here to go back to home */}
            <br />
            <br />
            <h4 className="text-center"><a href='/'>Click here to go back home</a></h4>

        </div>
    )
}