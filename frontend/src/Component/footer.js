import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../Images/Logo/eTimely-540x200.png"
import '../Css/footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {
    return (
      <>
        <div>
            <Navbar className="footer">
                <img className="footer-logo" src={logo} alt="eTimely"></img>
                <div className="footer-button-group">
                    <p><Nav>
                    <Nav.Link id="footer-button" href="https://icons8.com/" target="_blank">
                        <br></br>Icons 8</Nav.Link>
                    <Nav.Link id="footer-button" href="https://icons8.com/illustrations" target="_blank">
                        <br></br>Illustrations</Nav.Link>
                    <Nav.Link id="footer-button" href="/termsAndConditions">
                        <br></br>Terms and Conditions</Nav.Link>
                    </Nav></p>
                </div>
            </Navbar>
        </div>
      </>
    );
}