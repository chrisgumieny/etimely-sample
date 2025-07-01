import React from 'react';
import styled from 'styled-components';

// Styled Components
const ContactUsTextStyle = styled.div`
  max-width: 500px;
  margin: 0 auto;
  font-size: 1.8rem;
  line-height: 1.3em;
  @media only screen and (max-width: 768px) {
    font-size: 1.4rem;
  }

  .text {
    color: white;
}
`;

// Function to display section of contact us page
export default function ContactUsText({ children }) {
  return (
    <ContactUsTextStyle className="para">
      <p>{children}</p>
    </ContactUsTextStyle>
  );
}
