import React from 'react'
import Card from 'react-bootstrap/Card';
import "../Css/announcement.css"



export default function StaffAnnouncementCard({ response }) {
  const created = new Date(response.createdAt);

  return (
    <div>
      <Card className="announcementCard">
        <Card.Header>
          <Card.Title>{response.title}</Card.Title>
          <Card.Subtitle>{created.toLocaleDateString() + ' ' + created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Text className='announcementText'>
            {response.details}
          </Card.Text>

        </Card.Body>
      </Card>
    </div>
  )
}