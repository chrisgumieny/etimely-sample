import React from 'react'
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import "../Css/announcement.css"





export default function AnnouncementCard({ response, handleDelete }) {
  const created = new Date(response.createdAt);
  return (
    <div>
      <Card className="announcementCard">
          <Card.Header className='announceHeader'>
            <Card.Title >{response.title}</Card.Title>
            <Card.Subtitle >{created.toLocaleDateString() + ' ' + created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Card.Subtitle>
          </Card.Header>
        <Card.Body>
          <Card.Text className='announcementText'>
            {response.details}
          </Card.Text>
          <div className="deleteButton"><Button variant="primary" size="sm" onClick={() => handleDelete(response.announcementId)}>Delete</Button></div>
        </Card.Body>
      </Card>
    </div>
  )
}