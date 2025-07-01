// Import Dependencies
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "../../Component/businessSidebar";
import Swal from "sweetalert2";
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";

// Function to allow a business to view their profile as well as update their profile
export default function BusinessProfilePage() {
  const navigate = useNavigate();


  // Usestate to set initial values for the form, to be used in the form
  const [currentCompanyName, setCurrentCompanyName] = useState(null);
  const [currentCompanyEmail, setCurrentCompanyEmail] = useState(null);

  // UseEffect API call to get the current user's profile from the database and display on the profile page
  useEffect(() => {
    const getBusinessStaffById = async () => {
      if (isBusinessLoggedIn()) {
        const user = localStorage.getItem("Business user");
        const companyId = JSON.parse(user).companyId;
        const response = await fetch(
          `http://localhost:5001/etimely/business/getBusinessUserById/${companyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setCurrentCompanyName(data.companyName);
        setCurrentCompanyEmail(data.companyEmail);
      }
    };
    getBusinessStaffById();
  }, []);

  // Function allows user to toggle between showing and hiding password
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = (e) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  // Business Profile Form Validation
  const validatationSchemaToUpdate = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
  });

  // Business Profile password form validation
  const validatationSchemaToUpdatePassword = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Current password is required"),
    newPassword: Yup.string()
      .required("Password field cannot be empty")
      .matches(/(?=.*[0-9])/, "Password must contain at least one number")
      .matches(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
      .matches(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
      .min(8, "Password must be at least 8 characters"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password field cannot be empty"),
  });



  // Function to call update API to update the business profile
  const onSubmit = async (values) => {
    const user = localStorage.getItem("Business user");
    const companyId = JSON.parse(user).companyId;
    const response = await fetch(
      `http://localhost:5001/etimely/business/updateBusinessUser/${companyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      Swal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonColor: "#0077ff",
        confirmButtonText: "OK",
        willClose: () => {
          window.location.reload();
        },
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Profile update failed",
        icon: "error",
        confirmButtonColor: "#0077ff",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to call update API to update the business profile password
  const onSubmitPassword = async (values) => {
    const user = localStorage.getItem("Business user");
    const companyId = JSON.parse(user).companyId;
    const response = await fetch(
      `http://localhost:5001/etimely/business/updateBusinessUserPassword/${companyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();
    if (data.status === "success") {
      Swal.fire({
        title: "Success",
        text: "Password updated successfully",
        icon: "success",
        confirmButtonColor: "#0077ff",
        confirmButtonText: "OK",
        willClose: () => {
          window.location.reload();
        },
      });
    } else if (data.status === "error") {
      Swal.fire({
        title: "Error",
        text: data.message,
        icon: "error",
        confirmButtonColor: "#0077ff",
        confirmButtonText: "OK",
      });
    }
  };



  return (
    // Business Profile to allow business to update their profile
    <div>
      {isBusinessLoggedIn() ? (
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              pt: 8,
              width: { sm: "calc(100% - 250px)" },
            }}
          >
            <div>
              <br />
              <br />
              <h2>Business Profile</h2>
              <br />
              <p>View and update your business profile</p>
              <br />
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <Formik
                          enableReinitialize={true}
                          // Initial values to grab in the form
                          initialValues={{
                            companyName: currentCompanyName,
                            companyEmail: currentCompanyEmail,
                          }}
                          validationSchema={validatationSchemaToUpdate}
                          onSubmit={(values) => {
                            onSubmit(values);
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                          }) => (
                            //   Create form for business user to update their profile
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <label htmlFor="companyEmail">
                                  Company Email
                                </label>
                                <input
                                  type="text"
                                  name="companyEmail"
                                  id="companyEmail"
                                  className="form-control"
                                  placeholder="Company Email"
                                  value={currentCompanyEmail}
                                  disabled
                                />
                              </div>
                              <br></br>
                              <div className="form-group">
                                <label htmlFor="companyName">
                                  Company Name
                                </label>
                                <input
                                  type="text"
                                  name="companyName"
                                  id="companyName"
                                  className="form-control"
                                  placeholder="Company Name"
                                  value={values.companyName}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    handleChange(e);
                                    setCurrentCompanyName(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                />
                                {errors.companyName && touched.companyName && (
                                  <div className="text-danger">
                                    {errors.companyName}
                                  </div>
                                )}
                              </div>
                              <br></br>
                              <button type="submit" className="btn btn-primary">
                                Update Profile
                              </button>
                            </form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>




              <br />
              <p>Change Current Password</p>
              {/* Change Password */}
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <Formik
                        enableReinitialize={true}
                          initialValues={{
                            oldPassword: "",
                            newPassword: "",
                            confirmNewPassword: "",
                          }}
                          validationSchema={validatationSchemaToUpdatePassword}
                          onSubmit={(values) => {
                            onSubmitPassword(values);
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                          }) => (
                            //   Create form for business user to update their profile
                            <form onSubmit={handleSubmit}>
                              <div className="password mb-3">
                                <label htmlFor="staffLastName">Current password</label>
                                <div className="input-group">
                                  <input
                                    autocomplete="off"
                                    className="form-control"
                                    type={showPassword ? "text" : "password"}
                                    name="oldPassword"
                                    id="oldPassword"
                                    placeholder="Enter current password*"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.oldPassword}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={(e) => togglePassword(e)}
                                  >
                                    <i
                                      className={
                                        showPassword
                                          ? "far fa-eye"
                                          : "far fa-eye-slash"
                                      }
                                    ></i>{" "}
                                  </button>
                                </div>
                                {errors.oldPassword && touched.oldPassword && (
                                  <div className="text-danger">
                                    {errors.oldPassword}
                                  </div>
                                )}
                              </div>
                              {/* Password */}
                              <br></br>
                              <div className="password mb-3">
                                <label htmlFor="staffLastName">Create new password</label>
                                <div className="input-group">
                                  <input
                                    autocomplete="off"
                                    className="form-control"
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    id="newPassword"
                                    placeholder="Enter new password*"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.newPassword}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={(e) => togglePassword(e)}
                                  >
                                    <i
                                      className={
                                        showPassword
                                          ? "far fa-eye"
                                          : "far fa-eye-slash"
                                      }
                                    ></i>{" "}
                                  </button>
                                </div>
                                {errors.newPassword && touched.newPassword && (
                                  <div className="text-danger">
                                    {errors.newPassword}
                                  </div>
                                )}
                              </div>
                              {/* Button */}
                              {/* Confirm Password */}
                              <br></br>
                              <div className="password mb-3">
                                <label htmlFor="staffLastName">
                                  Confirm new password 
                                </label>
                                <div className="input-group">
                                  <input
                                    autocomplete="off"
                                    className="form-control"
                                    type={showPassword ? "text" : "password"}
                                    name="confirmNewPassword"
                                    id="confirmNewPassword"
                                    placeholder="Confirm password*"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmNewPassword}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={(e) => togglePassword(e)}
                                  >
                                    <i
                                      className={
                                        showPassword
                                          ? "far fa-eye"
                                          : "far fa-eye-slash"
                                      }
                                    ></i>{" "}
                                  </button>
                                </div>
                                {errors.confirmNewPassword &&
                                  touched.confirmNewPassword && (
                                    <div className="text-danger">
                                      {errors.confirmNewPassword}
                                    </div>
                                  )}
                              </div>
                              <button type="submit" className="btn btn-primary">
                                Update Password
                              </button>
                            </form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Box>
      ) : (
        <NotLoggedIn />
      )}
    </div>
  );
}