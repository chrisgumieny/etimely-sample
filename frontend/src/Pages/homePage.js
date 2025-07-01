import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Navigation from "../Component/navigation.js";
import Footer from "../Component/footer.js";
import onePageCalendar from "../Images/Home/onePageCalendar.png";
import calendarIcon from "../Images/Home/calendarIcon.png";
import clockIcon from "../Images/Home/clockIcon.png";
import suitcaseIcon from "../Images/Home/suitcaseIcon.png";
import "../Css/home.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
    return (
        <>
            <Navigation/>
                <div> 
                    <CardGroup className="mobile-view">
                        <div className="home-section-1">
                            <Card className="border-0 home-section-1-text">
                                <Card.Body>
                                    <h2 className="home-h2">Get more done by doing more.</h2>
                                        <p className="home-p">eTimely has everything you need to run your business.</p>
                                            <div className="get-started-button">
                                                <Button id="get-started-big" href="/Business/Signup" size="lg" variant="primary">Sign Up</Button>
                                                <Button id="get-started-small" href="/Business/Signup" size="sm" variant="primary">Sign Up</Button>
                                            </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="border-0 home-section-1-image">
                            <img className="one-page-calendar" src={onePageCalendar} alt="Calendar Illustration"></img>
                        </div>
                    </CardGroup>
                </div>
                <Card className="home-section-2"> 
                    <Card.Body>
                        <h3 className="home-h3">One dashboard to automate work scheduling, attendance, and more.</h3>
                    </Card.Body>
                </Card>
                <CardGroup>
                    <div className="home-section-2-card-group">
                        <div>
                            <Card className="home-section-2-card-left">
                                <Card.Title>
                                    <h4 className="home-h4"><img className="icon" src={calendarIcon} alt="Calendar Icon"></img> Smarter Scheduling</h4>
                                </Card.Title>
                                <Card.Body>
                                    <p className="home-p home-section-2-card-text">Manage all your employee scheduling needs in one app. Create schedules,
                                    view shift assignments, manage shift swaps, avoid scheduling conflicts and get alerts for no shows.
                                    Set up one-time or recurring shifts as a part of your projects or work orders.</p>
                                </Card.Body>
                            </Card></div><div>
                            <Card className="home-section-2-card-center">
                                <Card.Title>
                                    <h4 className="home-h4"><img className="icon" src={clockIcon} alt="Clock Icon"></img> Designated Timesheets</h4>
                                </Card.Title>
                                <Card.Body>
                                    <p className="home-p home-section-2-card-text">Keep track of detailed timesheets for all of your employees. 
                                    Schedules can be filtered be role or shown for everyone in the organization.</p>
                                </Card.Body>
                            </Card></div><div>
                            <Card className="home-section-2-card-right">
                                <Card.Title>
                                    <h4 className="home-h4"><img className="icon" src={suitcaseIcon} alt="Suitcase Icon"></img> Vacation Management</h4>
                                </Card.Title>
                                <Card.Body>
                                    <p className="home-p home-section-2-card-text">Set up time off, vacation and sick day policies for each employee or your organization as a whole.
                                    Manage balances, and review and approve time off requests with eTimely's scheduling tool.</p>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </CardGroup>
            <Footer/>
        </>
    );
}