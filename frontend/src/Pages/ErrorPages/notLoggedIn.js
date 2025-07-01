import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function NotLoggedIn() {
    const navigate = useNavigate();
  return (
    <div>
            <h2>You are not logged in</h2>
            <Button
              className="styles"
              variant="primary"
              type="submit"
              onClick={() => navigate("/userLogin")}
            >
              Login
            </Button>
          </div>
  )
}