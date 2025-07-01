// Import Dependencies
import React from 'react';
import styled from 'styled-components';
import { MdEmail, MdPlace } from 'react-icons/md';
import ContactUsForm from './ContactUsForm.js';
import ContactInfoItem from './ContactDetails';


// Styled Components
const ContactSectionStyle = styled.div`
  .contactSection__wrapper {
    display: flex;
    gap: 5rem;
    margin-top: 7rem;
    justify-content: space-between;
    position: relative;
  }

  .contactSection__wrapper::after {
    position: absolute;
    content: '';
    width: 2px;
    height: 50%;
    background-color: #0077ff;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
  }
  .left {
    width: 100%;
    max-width: 500px;
  }
  .right {
    max-width: 500px;
    width: 100%;
    border-radius: 12px;
    /* padding-left: 3rem; */
  }
  @media only screen and (max-width: 768px) {
    .contactSection__wrapper {
      flex-direction: column;
    }
    .contactSection__wrapper::after {
      display: none;
    }
    .left,
    .right {
      max-width: 100%;
    }
    .right {
      padding: 4rem 2rem 2rem 2rem;
    }
  }
`;


// Function to display section of contact us page
// Both the forms and the text
export default function ContactSection() {
  return (
    <ContactSectionStyle>
      <div className="container">
      <h2>Contact Us</h2>
            <p>We'd love to hear from you</p>
        <div className="contactSection__wrapper">
          {/* Align contents to left */}
          <div className="left">
            <ContactInfoItem icon={<MdEmail />} text="etimelymail@gmail.com" />
            <ContactInfoItem icon={<MdPlace />} text="Wayne State University" />
          </div>
          {/* Align contents to right */}
          <div className="right">
            <ContactUsForm />
          </div>
        </div>
      </div>
    </ContactSectionStyle>
  );
}
