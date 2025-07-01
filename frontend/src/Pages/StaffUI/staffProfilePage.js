// Import Dependencies
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "../../Component/staffSidebar";
import Swal from "sweetalert2";
import {isStaffLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";

// Function to allow staff to view their profile as well as update their profile
export default function StaffProfilePage() {
  const navigate = useNavigate();


  // Usestate to set initial values for the form, to be used in the form
  const [currentCompany, setCurrentCompany] = useState(null);
  const [currentstaffFirstName, setCurrentStaffFirstName] = useState("");
  const [currentstaffLastName, setCurrentStaffLastName] = useState("");
  const [currentstaffEmail, setCurrentStaffEmail] = useState("");
  const [currentRoleId, setCurrentRoleId] = useState("");

  useEffect(() => {
    const getStaffUserById = async () => {
      if (isStaffLoggedIn()) {
        const user = localStorage.getItem("Staff user");
        const staffId = JSON.parse(user).staffId;
        const response = await fetch(
          `http://localhost:5001/etimely/staff/getStaffUserById/${staffId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        // set staff first name
        setCurrentStaffFirstName(data.staffFirstName);
        // set staff last name
        setCurrentStaffLastName(data.staffLastName);
        // set staff email
        setCurrentStaffEmail(data.staffEmail);
        // set current company
        setCurrentCompany(data.companyName);
        // Set roleId
        setCurrentRoleId(data.roleId);

      }
    };
    getStaffUserById();
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

  // Staff Profile Form Validation
  const validationSchemaToUpdate = Yup.object().shape({
    staffFirstName: Yup.string().required("First name is required"),
    staffLastName: Yup.string().required("Required"),
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

  // Function to call update API to update the staff profile
  const onsubmit = async (values) => {
    if (isStaffLoggedIn()) {
      const user = localStorage.getItem("Staff user");
      const staffId = JSON.parse(user).staffId;
      const response = await fetch(
        `http://localhost:5001/etimely/staff/updateStaffUser/${staffId}`,
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
    }
  };

  // Function to call update API to update the staff password
  const onsubmitPassword = async (values) => {
    const user = localStorage.getItem("Staff user");
    const staffId = JSON.parse(user).staffId;
    const response = await fetch(
      `http://localhost:5001/etimely/staff/updateStaffUserPassword/${staffId}`,
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
    // Staff profile to allow staff to update their profile
    <div>
      {isStaffLoggedIn() ? (
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
              <h2>Staff Profile</h2>
              <br />
              <p>View and update your staff profile</p>
              <br />
              {/* Set current values and allow users to update */}
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <Formik
                          enableReinitialize={true}
                          initialValues={{
                            staffFirstName: currentstaffFirstName,
                            staffLastName: currentstaffLastName,
                            staffEmail: currentstaffEmail,
                            roleId: currentRoleId,
                          }}
                          validationSchema={validationSchemaToUpdate}
                          onSubmit={(values) => {
                            onsubmit(values);
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
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <label htmlFor="companyName">
                                  Company Associated
                                </label>
                                <input
                                  type="text"
                                  name="companyName"
                                  id="companyName"
                                  className="form-control"
                                  placeholder="Company"
                                  value={currentCompany}
                                  disabled
                                />
                              </div>
                              <br></br>
                              {/* Email */}
                              <div className="form-group">
                                <label htmlFor="staffEmail">Email</label>
                                <input
                                  type="text"
                                  name="staffEmail"
                                  id="staffEmail"
                                  className="form-control"
                                  placeholder="Email"
                                  value={currentstaffEmail}
                                  disabled
                                />
                                <br></br>
                              </div>
                              {/* Role */}
                              <div className="form-group">
                                <label htmlFor="staffEmail">Role</label>
                                <input
                                  type="text"
                                  name="roleId"
                                  id="roleId"
                                  className="form-control"
                                  placeholder="roleId"
                                  value={currentRoleId}
                                  disabled
                                />
                                <br></br>
                              </div>
                              <div className="form-group">
                                <label htmlFor="staffFirstName">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  name="staffFirstName"
                                  id="staffFirstName"
                                  className="form-control"
                                  placeholder="First Name"
                                  value={values.staffFirstName}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    handleChange(e);
                                    setCurrentStaffFirstName(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                />
                                {errors.staffFirstName &&
                                  touched.staffFirstName && (
                                    <div className="text-danger">
                                      {errors.staffFirstName}
                                    </div>
                                  )}
                              </div>
                              <br></br>
                              <div className="form-group">
                                <label htmlFor="staffLastName">Last Name</label>
                                <input
                                  type="text"
                                  name="staffLastName"
                                  id="staffLastName"
                                  className="form-control"
                                  placeholder="Last Name"
                                  value={values.staffLastName}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    handleChange(e);
                                    setCurrentStaffLastName(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                />
                                {errors.staffLastName &&
                                  touched.staffLastName && (
                                    <div className="text-danger">
                                      {errors.staffLastName}
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
                            onsubmitPassword(values);
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
                                    placeholder="Confirm new password*"
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