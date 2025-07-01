import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import logo from "../Images/Logo/eTimely-540x200.png"
import '../Css/navigation.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navigation() {
    return (
     <>
        <Navbar>
            <Card className="logo-card">
                <img className="logo" src={logo} alt="eTimely"></img>
            </Card>
            <div className="navigation-bar">
                <div className="mobile-logo-card">
                    <img className="mobile-logo" src={logo} alt="eTimely"></img>
                </div>
                <Nav.Link id="nav-card" href="/">Home</Nav.Link>
                <Nav.Link id="nav-card" href="/aboutUs">About Us</Nav.Link>
                <Nav.Link id="nav-card" href="/contactUs">Contact Us</Nav.Link>
                <Button id="nav-card" className="sign-in-button" href="/userLogin">Sign In</Button>
            </div>
        </Navbar>
      </>
    );
}