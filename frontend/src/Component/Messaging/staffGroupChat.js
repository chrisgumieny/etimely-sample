import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { collection, query, onSnapshot, where, orderBy, limit } from "firebase/firestore";
import {
  Button,
  Form,
} from 'react-bootstrap';
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import { Formik } from "formik";
import * as Yup from "yup";
import { isStaffLoggedIn } from "../../Utils/Auth";
import NotLoggedIn from "../../Pages/ErrorPages/notLoggedIn";
import { db } from "../../firebase-config";
import { formatRelative } from 'date-fns';


const useStyles = makeStyles((theme) => ({
    content: {
      padding: 0,
    },
    root: {
      display: "flex",
      padding: "0",
      height: "70vh",
  
      "@media (max-width: 600px)": {
        height: "89vh",
      },
    },
    chatContainer: {
      display: "flex",
      flexFlow: "column",
      flex: "1",
      margin: ".5em 1em 0 1em",
  
      "@media (max-width: 600px)": {
        margin: "1em 0",
      },
    },
    chatMessageWindow: {
      border: "1px solid #ccc",
      borderRadius: "3px",
      flex: "1",
      fontSize: "13px",
  
      overflowY: "auto",
      padding: "4px",
  
      "@media (max-width: 600px)": {
        border: "none",
        borderRadius: "0",
        padding: "0",
      },
    },
    chatBar: {
      display: "flex",
      margin: "1em 0",
      alignSelf: "flex-end",
  
      "@media (max-width: 600px)": {
        margin: "0",
      },
    },
    chatBarInput: {},
    chatSendButton: {},
    userListPanel: {
      flex: "0 1",
      alignSelf: "flex-start",
    },
    userListIcon: {
      marginRight: "0.5em",
    },
    mobileUserList: {
      margin: "1em",
    },
    UserListDivider: {
      width: "100%",
    },
    typing: {
      margin: "1rem",
    },
    chatMessageInitial: {
      paddingLeft: "80px",
      marginLeft: "-72px",
    },
    chatMessageSequential: {
      paddingLeft: "64px",
    },
    chatAvatar: {
      margin: 0,
    },
    chatMessageWrapper: {
      display: "flex",
      flexDirection: "column",
    },
    fromUserBubble: {
      marginBottom: ".5rem",
      maxWidth: "fit-content",
    },
    chatDivider: {
      width: "100%",
      marginBottom: "1rem",
    },
  }));



  export default function StaffGroupChat({theme}) {
      const [currentstaffFirstName, setCurrentStaffFirstName] = useState("");
    const [currentstaffLastName, setCurrentStaffLastName] = useState("");
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [chatMessages, setChatMessages] = React.useState([]);
    const [staffDetailsArray, setStaffDetailsArray] = useState([]);
    const classes = useStyles(theme);


    

    const initialValues = {
      message: ""
    };

    const bottomListRef = useRef();
    
      const validationSchema = Yup.object().shape({
        message: Yup.string()
          .required("Required")
          .max(200, "Must be 200 characters or less"),
      });

      useEffect(() => {
        if (isStaffLoggedIn()) {
        const user = localStorage.getItem("Staff user");
        const getCompanyId = JSON.parse(user).companyId;

        const getCurrentStaffFirstName = JSON.parse(user).staffFirstName;
        const getCurrentStaffLastName = JSON.parse(user).staffLastName;

        setCurrentStaffFirstName(getCurrentStaffFirstName);
        setCurrentStaffLastName(getCurrentStaffLastName);
        setCurrentCompanyName(getCompanyId);

        const getMessages = query(collection(db, "Messages"), 
          where("companyId", "==", getCompanyId),
          orderBy("createdAt"),
          limit(100)
        );

      
        // Convert companyId to its company name and set it to the state
        // First get BusinessUser collection
        const getBusinessUser = query(collection(db, "BusinessUser"),
          where("companyId", "==", getCompanyId)
          
        );



        // Get Company Name
        const getCompanyName = onSnapshot(getBusinessUser, (snapshot) => {
          snapshot.forEach((doc) => {
            const getCompanyName = doc.data().companyName;
            setCurrentCompanyName(getCompanyName);
          });
        });

       
      
        const unsub = onSnapshot(getMessages, (QuerySnapshot) => {
          const messages = QuerySnapshot.docs.map((doc) => doc.data());
          setChatMessages(messages);
        })


        // Function to map through all StaffUser collection and push to staffDetailsArray state
        const getStaffDetails = query(collection(db, "StaffUser"),
        where("companyId", "==", getCompanyId),
      );

      const getStaffDetailsArray = onSnapshot(getStaffDetails, (snapshot) => {
        const staffDetails = snapshot.docs.map((doc) => doc.data());
        setStaffDetailsArray(staffDetails);
      });

    

        return () => {
          unsub();
          getCompanyName();
          getStaffDetailsArray();
        };
      }
      }, []);


// OnSubmit function to allow user to send message
      const onSubmit = (values, { setSubmitting }) => {
        const user = localStorage.getItem("Staff user");
        const StaffId = JSON.parse(user).staffId;
        const CompanyId = JSON.parse(user).companyId;

        const response = Axios.post(
            `http://localhost:5001/etimely/createMessagebyStaff/${StaffId}/${CompanyId}`,
            {
                message: values.message
                
            }
        );
        values.message = "";
        setSubmitting(false);
        bottomListRef.current.scrollIntoView({ behavior: 'smooth' });

      };

      // Function to format the date in this format: Today at 4:38 AM
      const formatDate = (date) => {

        const newDate =  formatRelative(new Date(date), new Date());

        // UpperCase the first letter
        const newDateUpperCase = newDate.charAt(0).toUpperCase() + newDate.slice(1);

        return newDateUpperCase;
      };



      return (
        <>
        <div>
            {isStaffLoggedIn() ? (
              <div className={classes.root}>
                <div className={classes.chatContainer}>
                  <div className={classes.chatMessageWindow}>
                    <List>
                      {chatMessages.map((message, index) => {
                        if (message.sender === "business") {
                          return (
                            <>
                              <div key={index} className={classes.chatMessageWrapper}>
                          <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                              <Avatar
                                alt="Avatar"
                                style={{
                                  backgroundColor: "#90EE90",
                                  color: "black",
                        }}
                        >
                          {`${currentCompanyName.charAt(0)}`}
                        </Avatar>
                            </ListItemAvatar>
                              <div>
                            <Chip
                              size="small"
                              label={currentCompanyName}
                              className={classes.fromUserBubble}
                              style={{
                                backgroundColor: "#90EE90",
                                color: "black",
                                fontSize: "12px",
                                fontWeight: "bold",
                                margin: "0",
                      }}
                    ></Chip>
                    <br></br>
                      <br></br>
                      <Typography 
                      className={classes.chatMessageInitial} variant="body1">
                    {message.message}
                  </Typography>
                            </div>
                            <Typography 
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  className={classes.chatMessageInitial} variant="body1">
                    {formatDate(message.createdAt)}
                  </Typography>
                  </ListItem>
                        {index !== chatMessages.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </div>
                      </>
                          );
                        } else if (message.sender === "staff") {
                          return (
                            <>
                              <div key={index} className={classes.chatMessageWrapper}>
                            <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                              <Avatar
                                alt="Avatar"
                                style={{
                                  backgroundColor: "#0077ff",
                                  color: "white",
                            }}
                    >
                      {
                        staffDetailsArray.map((staff) => {
                          if (staff.staffId === message.staffId) {
                            return `${staff.staffFirstName.charAt(0)}`
                          }
                        }
                        )
                      }
                    </Avatar>
                    </ListItemAvatar>
                              <div>
                              <Chip
                                  size="small"
                                  label={
                                    staffDetailsArray.map((staff) => {
                                      if (staff.staffId === message.staffId) {
                                        return `${staff.staffFirstName} ${staff.staffLastName}`
                                      }
                                    }
                                    )
                                  }
                                  className={classes.fromUserBubble}
                                  style={{
                                    backgroundColor: "#0077ff",
                                    color: "white",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    margin: "0",
                                  }}
                                ></Chip>
                                <br></br>
                                  <br></br>
                                  <Typography 
                                  className={classes.chatMessageInitial} variant="body1">
                                {message.message}
                              </Typography>
                              </div>
                              <Typography 
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                }}
                                  className={classes.chatMessageInitial} variant="body1">
                                    {formatDate(message.createdAt)}
                      </Typography>
                      </ListItem>
                              {index !== chatMessages.length - 1 && (
                                <Divider variant="inset" component="li" />
                              )}
                              </div>
                              <div ref={bottomListRef} />

                            </>
                          );
                        }
                      })}
                    </List>
                  </div>
                
                  
    {/* Display form for users to type in their messages */}              
    <br></br>
    <div>
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
          <form onSubmit={handleSubmit}>
                <Form.Group widths="four" style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>
                  <Form.Control
                    autocomplete="off"
                    type="text"
                    name="message"
                    placeholder="Enter Messages"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message}
                  />
                  <br></br>
                  &nbsp;&nbsp;
                  <Button 
                  primary
                  type="submit">
                  Send
              </Button>
                </Form.Group>
          </form>
        )}
      </Formik>
    </div>
    </div>
    </div>
    
  ) : (
    <NotLoggedIn />
  )}
</div>
</>
      )
  }