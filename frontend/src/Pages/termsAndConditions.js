import React from "react";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import agreement from '../Images/Terms/agreement.png';
import Navigation from "../Component/navigation.js";
import Footer from "../Component/footer.js";
import "../Css/termsAndCond.css";
import "bootstrap/dist/css/bootstrap.min.css";


function TermsAndConditions() {
    return (
        <>
            <Navigation/>
                <div> 
                    <CardGroup className="terms-style">
                        <Card className="border-0 terms-image">
                            <img className="agreement" src={agreement} alt="agreement" />
                        </Card>
                        <Card className="border-0">
                            <h2 className="terms-h2">Terms and Conditions</h2>
                                <p className="terms-p">
                                eTimely takes pride in providing an open communication platform for your team. 
                                We want this to be a welcoming and secure environment for users. 
                                Please review the list of permitted behaviors on this platform. 
                                Anyone who violates the terms and conditions will have their account banned and they will be removed from the site.
                                The following are the application's terms of use:</p>
                                <p className="terms-p">Users must be at least 14 years old.</p>
                                <p className="terms-p">Users must sign in with their real name. </p>
                                <p className="terms-p">Users must provide accurate personal information.</p>
                                <p className="terms-p">Users are only permitted to register for one account at a time.</p>
                                <p className="terms-p">Users will refrain from using profanity or derogatory language.</p>
                                <p className="terms-p">This platform will not be used by users to sell goods or services.</p>
                                <p className="terms-p">Users will not use this platform to plan or carry out violent or criminal acts.</p>
                                <p className="terms-p">This platform will not be used for political or religious content.</p>
                        </Card>
                    </CardGroup>
                </div>
            <Footer/>
        </>
    );
} 

export default TermsAndConditions;