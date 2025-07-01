// Import Dependencies
import React from 'react';
import { MdPlace } from 'react-icons/md';
import styled from 'styled-components';
import ContactUsText from './ContactUsText';

// Styled Components
const ContactUsDetailsStyle = styled.div`
  padding: 2rem;
  background-color: var(--deep-dark);
  display: flex;
  align-items: center;
  gap: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;

  .icons {
    color: #0077ff;
    background-color: var(--gray-2);
    //padding: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 2.5rem;
  }
  svg {
    width: 3.5rem;
  }
`;

// Function to take in props icon and text and return a styled component
export default function ContactInfoItem({
  icon = <MdPlace />,
  text = 'I need text ',
}) {
  return (
    <ContactUsDetailsStyle>
      <div className="icons">{icon}</div>
      <div className="info">
        <ContactUsText>{text}</ContactUsText>
      </div>
    </ContactUsDetailsStyle>
  );
}
