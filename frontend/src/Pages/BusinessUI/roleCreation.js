import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import Sidebar from "../../Component/businessSidebar";
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0077ff",
      color: "theme.palette.common.white",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));


// Create columns for First Name, Last Name, Email, Role, and Actions
const columns = [
    { id: "role", label: "Role", minWidth: 100, align: "center" },
    { id: "actions", label: "Actions", minWidth: 80, align: "center" },
  ];

export default function RoleCreation() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);


  // Edit functionality
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  

  const [currentRoleId, setCurrentRoleId] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  const initialValuesToUpdate = {
    role: currentRole,
  };

  const validatationSchemaToUpdate = Yup.object({
    role: Yup.string().required("Role is required"),
  });


  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  // UseEffect to get all the role and set the rows
  useEffect(() => {
    if (isBusinessLoggedIn) {
      const user = localStorage.getItem("Business user");
      const companyId = JSON.parse(user).companyId;
      fetch(`http://localhost:5001/etimely/role/getRolesByBusinessId/${companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRows(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);



// Function to update the role
  const updateRole = async (roleId, values) => {
    Axios.put(`http://localhost:5001/etimely/role/update/${roleId}`, values)
      .then((res) => {
        if (res.data.status === "success") {
          Swal.fire({
            title: "Success",
            text: "Role has been updated.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#0077ff",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to update role.",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#0077ff",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              window.location.reload();
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePastScheduleDelete = async (deletedId) => {
    await Axios.delete(`http://localhost:5001/etimely/schedule/${deletedId}`);
  };

  // Delete Role
  const terminateRole = async (roleId) => {
    const user = localStorage.getItem("Business user");
    const companyId = JSON.parse(user).companyId;

    // Display sweet alert to confirm staff termination
    Swal.fire({
      title: "Are you sure?",
      text: "The role will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0077ff",
      cancelButtonColor: "#9e9e9e",
      confirmButtonText: "Yes, delete role",
      // When user clicks on confirm button delete the role, else if they click cancel, do nothing
      showLoaderOnConfirm: true,
      preConfirm: async () => {

        let roleCount = 0, scheduleCount = 0;
        // Alert messages that will change based on the situation
        let errorMessage = "The role cannot be deleted due to it being assigned to <br>";
        let roleDeleteMessage = "The role has been deleted.";
        const pastSchedules = [];

        const employees = await Axios.get(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyId}`);

        // Increase the role count for each employee that is assigned to the selected role
        employees.data.forEach((employee) => {
          if (employee.role === roleId)
          {
            roleCount++;
          }
        })

        if (roleCount === 1)
        {
          errorMessage += roleCount + " employee";
        }
        else if (roleCount > 1)
        {
          errorMessage += roleCount + " employees";
        }

        await fetch(`http://localhost:5001/etimely/schedule/getSchedulesByRole/${roleId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
          })
          .then(res => res.json())
          .then(data => {
            data.forEach((data) => {
              // Increase the schedule count for each schedule that has already ended
              // Any past schedules will be added to the pastSchedules array for deletion
              if (new Date() <= new Date(data.end))
              {
                scheduleCount++;
              }
              else
              {
                pastSchedules.push(data.event_id);
                roleDeleteMessage = "The role and past shifts have been deleted.";
              }
            })

            if (scheduleCount === 1)
            {
              if (roleCount > 0) {
                errorMessage += " and ";
              }
              errorMessage += scheduleCount + " upcoming shift";
            }
            else if (scheduleCount > 1)
            {
              if (roleCount > 0) {
                errorMessage += " and "; 
              }
              errorMessage += scheduleCount + " upcoming shifts";
            }
          })
          .catch(err => console.log(err));
          
        if (roleCount === 0 && scheduleCount === 0)
        {
          pastSchedules.forEach((data) => {
            handlePastScheduleDelete(data);
          })

          await Axios.delete(
            `http://localhost:5001/etimely/role/delete/${roleId}`
          ).then(() => {
            Swal.fire({
              title: "Success",
              text: roleDeleteMessage,
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#0077ff",
              confirmButtonText: "OK",
            });
          });

          setRows(
            rows.filter((val) => {
              return val.roleId !== roleId;
              })
            );
        }
        else
        {
          Swal.fire({
            title: "Error",
            html: errorMessage + ".",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#0077ff",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };



  
  return (
    <>
    <div>
        {isBusinessLoggedIn ? (
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
                <h2>Role Management</h2>

                <p>Manage and create new roles for your business</p>
                <br />
                
                {/* Text field with submit button */}
                <Formik
                    initialValues={{
                        role: "",
                        
                    }}
                    validationSchema={Yup.object({
                        role: Yup.string()
                            .required("Role is required"),
                        
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                          const user = localStorage.getItem("Business user");
                            const companyId = JSON.parse(user).companyId;

                            Axios.post(`http://localhost:5001/etimely/role/add/${companyId}`, values)
                                .then((res) => {
                                    if (res.data.status === "success") {
                                        Swal.fire({
                                            title: "Success",
                                            text: "The role has been created.",
                                            icon: "success",
                                            showCancelButton: false,
                                            confirmButtonColor: "#0077ff",
                                            confirmButtonText: "OK",
                                        }).then((result) => {
                                            if (result.value) {
                                                window.location.reload();
                                            }
                                        });

                                    } else {
                                        Swal.fire({
                                            title: "Error",
                                            text: "Role already exists",
                                            icon: "error",
                                            showCancelButton: false,
                                            confirmButtonColor: "#0077ff",
                                            confirmButtonText: "OK",
                                        }).then((result) => {
                                            if (result.value) {
                                                window.location.reload();
                                            }
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                }
                            );
                            setSubmitting(false);
                        }, 500);
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
                            <Box>
                  <div className="filter-options">
                    <Box
                      sx={{
                        width: 300,
                        maxWidth: "100%",
                      }}
                      className="box"
                    >
                      <TextField
                        fullWidth
                        label="Create Role"
                        id="fullWidth"
                        multiline
                        variant="outlined"
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        
                      />
                      {errors.role && touched.role && (
                        <div className="text-danger">{errors.role}</div>
                      )}
                    </Box>
                    
                    <Button
                      className="InviteStaffButton"
                      variant="primary"
                        type="submit"
                    >
                      Create
                    </Button>
                  </div>
                </Box>
              </form>
                    )}
                </Formik>

                <br />
                {/* Show current user name, if business, get companyName. If staff, get staffFirstName */}
                <div className="roster-table">
                  <Paper
                    sx={{ width: "85%", overflow: "hidden" }}
                    aria-label="customized table"
                  >
                    <TableContainer sx={{ maxHeight: 860 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <StyledTableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                sx={{
                                  backgroundColor: "#f5f5f5",
                                  color: "white",
                                  variant: "text.heading",
                                  fontSize: "1.0rem",
                                }}
                              >
                                {column.label}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* For each row, add a edit and delete material ui button */}
                          {rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.code}
                                >
                                  {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {column.format &&
                                        typeof value === "number"
                                          ? column.format(value)
                                          : value}
                                        {/* Map through Actions and display a button */}
                                        {column.id === "actions" ? (
                                          <div>
                                            <Button
                                              className="roster-button-1"
                                              variant="primary" 
                                              onClick={() => {
                                                handleClickOpenEdit();

                                                setCurrentRoleId(row.roleId);
                                                setCurrentRole(row.role);
                                              }}
                                              color="primary"
                                            >
                                              Edit 
                                            </Button>
                                            &nbsp;&nbsp;
                                            <ThemeProvider
                                              theme={createTheme()}
                                            >
                                              <Dialog
                                                open={openEdit}
                                                onClose={handleCloseEdit}
                                                aria-labelledby="form-dialog-title"
                                                BackdropProps={{ style: {  opacity: "0.05"} }}
                                                PaperProps={{ style: { boxShadow: "none" } }}
                                              >
                                                <DialogTitle id="form-dialog-title"
                                                sx={{
                                                  width: 1000,
                                                  maxWidth: '100%',
                                              }}
                                                >
                                                  Edit Role
                                                </DialogTitle>
                                                <DialogContent>
                                                  <Formik
                                                    // Use initialValues to set the initial state of the form
                                                    initialValues={
                                                      initialValuesToUpdate
                                                    }
                                                    validationSchema={validatationSchemaToUpdate}
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
                                                        <TextField
                                                          autoComplete="off"
                                                          id="role"
                                                          name="role"
                                                          label="Role*"
                                                          type="text"
                                                          fullWidth
                                                          margin="dense"
                                                          variant="outlined"
                                                          value={values.role}
                                                          onChange={(e) => {
                                                            e.preventDefault();
                                                            handleChange(e);
                                                            setCurrentRole(e.target.value);
                                                          }
                                                          }
                                                          onBlur={handleBlur}
                                                        />
                                                        {errors.role && touched.role && (
                                                          <div className="text-danger">
                                                            {errors.role}
                                                          </div>
                                                        )}

                                                          <br />
                                                          <br />

                                                        <DialogActions>
                                                          <Button
                                                            onClick={
                                                              handleCloseEdit
                                                            }
                                                            color="primary"
                                                          >
                                                            Cancel
                                                          </Button>
                                                          <Button
                                                            type="submit"
                                                            color="primary"
                                                            onClick={() => {
                                                              updateRole(currentRoleId, 
                                                                values);
                                                              handleCloseEdit();
                                                            }}
                                                          >
                                                            Save
                                                          </Button>
                                                        </DialogActions>
                                                      </form>
                                                    )}
                                                  </Formik>
                                                </DialogContent>
                                              </Dialog>
                                            </ThemeProvider>
                                            {/* Show delete button if there are more than 5 roles. If a new role is added, show delete for that new created role */}
                                            {rows.length > 5 ? (
                                              <Button
                                                className="roster-button-1"
                                                variant="primary"
                                                onClick={() => {
                                                  terminateRole(row.roleId);
                                                }}
                                                color="secondary"
                                              >
                                                Delete
                                              </Button>
                                            ) : null}
                                          </div>
                                        ) : (
                                          <div></div>
                                        )}
                                      </StyledTableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[15, 25, 100]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </div>
              </div>
            </Box>
          </Box>
        ) : (
          <NotLoggedIn />
        )}
      </div>
    </>
  )
}