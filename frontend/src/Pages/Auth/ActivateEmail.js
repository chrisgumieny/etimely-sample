import React from 'react'
import { useEffect } from "react"
import Axios from "axios";
import checkmark from "../../Images/ActivateEmail/checkmark.png"
import '../../Css/activateEmail.css';

export default function ActivateEmail() {
    // Once page loads, check if user has clicked the verification link
    useEffect(() => {
        const business_token = window.location.href.split("/")[window.location.href.split("/").length - 1];
        const staff_token = window.location.href.split("/")[window.location.href.split("/").length - 1];
        try {
            // Call localhost:5000/etimely/verify/:token endpoint
            const business_response = Axios.get(`http://localhost:5001/etimely/business/verify/${business_token}`);
            const staff_response = Axios.get(`http://localhost:5001/etimely/staff/verify/${staff_token}`);
        }
        catch (error) {
            
        }
    }, []);

    // Display Account Activated UI if user has clicked the verification link
    return (
        <div>
            <div>
                <h2>
                    Account Activated!
                </h2>
                <br></br>
            <br></br>
            {/* checkmart logo */}
            <img src={checkmark} alt="checkmark" className="checkmark" />
            <br></br>
            <br></br>
                <p>
                    Hello!
                </p>
                {/* Show user that their account has been verified successfully */}
                <p>Thank you, your email has been verified. Your account is now active.
                    <br></br>Please use the link below to login to your account.
                </p>
            </div>
        </div>
    )
    }