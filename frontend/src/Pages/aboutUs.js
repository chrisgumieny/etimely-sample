import React from "react";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import team from '../Images/AboutUs/team.png';
import Navigation from "../Component/navigation.js";
import Footer from "../Component/footer.js";
import "../Css/aboutUs.css";
import "bootstrap/dist/css/bootstrap.min.css";


function AboutUs() {
    return (
        <>
            <Navigation />
                <div>
                    <CardGroup className="about-us-style">
                        <Card className="border-0 about-us-image">
                            <img className="team" img src={team} alt="team" />
                        </Card>
                        <Card className="border-0 about-us-text">
                            <Card.Body>
                                <h2 className="about-us-h2">About Us</h2>
                                <br/><br/>
                                <p className="about-us-p">eTimely was founded by four Wayne State University students to 
                                    address a common issue in the food service industry: an ever-changing schedule.
                                    We understand that things happen and our availability changes.
                                    eTimely provides a visual representation of how those changes might appear.
                                    We designed an easy-to-use interface and intuitive navigation with our users in mind.
                                    We've got you covered for everything from changing your availability to swapping shifts with a coworker.</p>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                </div>
            <Footer />
        </>
    );
}
export default AboutUs;