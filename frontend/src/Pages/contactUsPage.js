// Import Dependencies
import React from 'react'
import Navigation from "../Component/navigation.js";
import Footer from "../Component/footer.js";
import ContactSection from '../Component/ContactUs/ContactSection.js';



export default function ContactUsPage() {
    
  return (
    <>
    {/* Import Navigation Components */}
        <Navigation />
        {/* Import ContactSection Components */}
        <ContactSection />
        {/* Import Footer Components */}
        <Footer />
    </>
  )
}
