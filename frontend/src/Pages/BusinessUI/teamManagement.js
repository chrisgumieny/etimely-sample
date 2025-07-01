// Import Dependencies
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../../Css/roster.css";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import Sidebar from "../../Component/businessSidebar";
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";
import EnhancedTableHead from "../../Component/sortTable";


// Prop to allow dropdown select to be paginated
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


// Styling for the table
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
  { id: "staffFirstName", label: "First Name", minWidth: 100, align: "center" },
  { id: "staffLastName", label: "Last Name", minWidth: 100, align: "center" },
  { id: 'staffEmail', label: 'Email', minWidth: 100, align: "center" },
  { id: 'roleName', label: 'Role', minWidth: 100, align: "center" },
  { id: "accountStatus", label: "Account Status", minWidth: 100, align: "center" },
  { id: "actions", label: "Actions", minWidth: 80, align: "center" },
];


// Function to sort table in descending order by the selected column
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


// Function to sort table in ascending order by the selected column
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Function to sort
function stableSort(array, comparator) {
  // use Array.prototype.sort() directly to avoid the overhead of the stable
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}








// Team Management Function to display information in the Team Manangement page

export default function TeamManagement() {
  // Usestate for open and openEdit dialog
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);



  // Open popup for business invitation
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close popup for business invitation
  const handleClose = () => {
    setOpen(false);
  };

  // Edit functionality to open role popup
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  // Edit functionality to edit role popup
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };


  // Set initial state for the current row, email, first name, last name and role
  const [currentRowId, setCurrentRowId] = useState("");
  const [CurrentEmail, setCurrentEmail] = useState("");
  const [CurrentFirstName, setCurrentFirstName] = useState("");
  const [CurrentLastName, setCurrentLastName] = useState("");
  const [CurrentRoleName, setCurrentRoleName] = useState("");


  // Grab all the staff members infomation and allow to update
  const initialValuesToUpdate = {
    staffFirstName: CurrentFirstName,
    staffLastName: CurrentLastName,
    staffEmail: CurrentEmail,
    roleName: CurrentRoleName,
  };


  const navigate = useNavigate();

  // Roles
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('staffFirstName');
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  // Delcare Array to save remote roles fetched from the database
  const rolesArray = [];

  useEffect(() => {
    if (isBusinessLoggedIn()) {
      const user = localStorage.getItem("Business user");
      const companyid = JSON.parse(user).companyId;
      fetch(
        `http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setRows(data);
        })

        .catch((err) => {
          console.log(err);
        }
        );
    }
  }, []);


  // If user is logged in, get the company name
  const returnCompanyName = () => {
    if (isBusinessLoggedIn()) {
      const user = localStorage.getItem("Business user");
      const companyName = JSON.parse(user).companyName;
      return companyName;
    }
  };

  // If user is logged in, get the company id
  const returnCompanyId = () => {
    if (isBusinessLoggedIn()) {
      const user = localStorage.getItem("Business user");
      const companyId = JSON.parse(user).companyId;
      return companyId;
    }
  };



  // UseState to save the role fetched from the database
  const [roles, setRoles] = useState([]);


  // UseEffect to call Roles API to get all the roles created by the business
  useEffect(() => {
    if (isBusinessLoggedIn()) {
      const user = localStorage.getItem("Business user");
      const companyId = JSON.parse(user).companyId;
      fetch(
        `http://localhost:5001/etimely/role/getRolesByBusinessId/${companyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setRoles(data);

        })
        .catch((err) => console.log(err));
    }
  }, [navigate]);



  // Map through roles and push to rolesArray
  roles.map((val) => {
    // Push roleId and role to rolesArray
    rolesArray.push({
      id: val.roleId,
      name: val.role,
    })
  });


  // Form validation
  const initialValue = {
    companyId: returnCompanyId(),
    companyName: returnCompanyName(),
    staffFirstName: "",
    staffLastName: "",
    staffEmail: "",
    roleName: "",
  };


  // Form validation 
  const validationSchema = Yup.object().shape({
    staffFirstName: Yup.string().required("First Name is required"),
    staffLastName: Yup.string().required("Last Name is required"),
    staffEmail: Yup.string()
      .email("Email is invalid")
      .required("Email is required"),
    roleId: Yup.string()
      .required("Role is required")
  });


  // Function to call generate invite API to send an invite to a staff member
  const onSubmit = async (values) => {
    const response = await Axios.post("http://localhost:5001/etimely/business/generateInviteLink", values);
    if (response.data.status === 'success') {
      Swal.fire({
        title: "Success",
        text: "Invitation has been sent.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0077ff",
        willClose: () => {
          window.location.reload()
        }
      });
    }

    else {
      Swal.fire({
        title: "Error",
        text: "Email is already used by a different account",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0077ff"

      });
    }
  };


  // Function to call Update Staff API to update staff member
  const updateStaff = async (staffId, values) => {
    Axios.put(`http://localhost:5001/etimely/business/updateStaff/${staffId}`, values)
      .then((res) => {
        if (res.data.status === "success") {
          Swal.fire({
            title: "Success",
            text: "Staff information has been updated.",
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
            text: "Failed to update staff information.",
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
      })
  };


  // Function to call Delete Staff API to delete staff member
  const terminateStaff = async (staffId) => {
    // Display sweet alert to confirm staff termination
    Swal.fire({
      title: "Are you sure?",
      text: "The staff user will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0077ff",
      cancelButtonColor: "#9e9e9e",
      confirmButtonText: "Yes, delete staff user",
      // When user clicks on confirm button delete the staff, else if they click cancel, do nothing
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        await Axios.delete(
          `http://localhost:5001/etimely/business/terminateStaff/${staffId}`
        ).then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'The staff user has been deleted.',
            confirmButtonColor: "#0077ff",
          })
          setRows(
            rows.filter((val) => {
              return val.staffId !== staffId;
            })
          );
        });
      },
    });
  };



  return (
    <>
      <div>
        {isBusinessLoggedIn() ? (
          <Box sx={{ display: "flex" }}>

            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 8,
                pt: 8,
                width: { sm: "calc(100% - 250px)" },
              }}
            >
              <div>
                <br />
                <br />
                <h2>Team Management</h2>
                <p>Manage and view all staff members</p>
                <br />
                <Box>
                  <div className="filter-options">
                    <Box
                      sx={{
                        width: 300,
                        maxWidth: "100%",
                      }}
                      className="box"
                    >
                      {/* Implement a search bar that allows a business to search for user's first, last, and email address */}
                      <TextField
                        fullWidth
                        label="Search "
                        id="fullWidth"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            e.target.value === undefined ||
                            e.target.value === null
                          ) {
                            const user = localStorage.getItem("Business user");
                            const companyid = JSON.parse(user).companyId;

                            Axios.get(
                              `http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`
                            ).then((res) => {
                              setRows(res.data);
                            });
                          } else {
                            const user = localStorage.getItem("Business user");
                            const companyid = JSON.parse(user).companyId;

                            const AllRows = Axios.get(
                              `http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`
                            ).then((res) => {
                              const filterBy = [
                                "staffFirstName",
                                "staffLastName",
                                "staffEmail",
                              ];
                              const filterRows = res.data.filter((row) => {
                                for (let i = 0; i < filterBy.length; i++) {
                                  if (
                                    row[filterBy[i]]
                                      .toLowerCase()
                                      .includes(e.target.value.toLowerCase())
                                  ) {
                                    return true;
                                  }
                                }
                                return false;
                              });
                              setRows(filterRows);
                            });
                          }
                        }}
                      />
                      <FormHelperText>
                        &nbsp;Search for a staff member
                      </FormHelperText>
                    </Box>
                    <FormControl>
                      <InputLabel id="demo-simple-select-helper-label">
                        Role
                      </InputLabel>
                      {/* Implement a dropdown menu to allow users to filter table by roles  */}
                      <Select

                        sx={{
                          width: 300,
                          maxWidth: '100%',
                        }}

                        labelId="Role"
                        id="Role"
                        label="Role"
                        onChange={(e) => {
                          if (
                            e.target.value === 1 ||
                            e.target.value === undefined ||
                            e.target.value === null
                          ) {
                            // filter table by dropdown selection
                            const user = localStorage.getItem("Business user");
                            const companyid = JSON.parse(user).companyId;

                            Axios.get(
                              `http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`
                            ).then((res) => {
                              setRows(res.data);

                            });
                          } else {
                            const user = localStorage.getItem("Business user");
                            const companyid = JSON.parse(user).companyId;

                            const AllRows = Axios.get(
                              `http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`
                            ).then((res) => {
                              const filterBy = [
                                "roleName",
                              ];
                              const filterRows = res.data.filter((row) => {
                                for (let i = 0; i < filterBy.length; i++) {
                                  if (
                                    row[filterBy[i]]
                                      .toLowerCase()
                                      .includes(e.target.value.toLowerCase())
                                  ) {
                                    return true;
                                  }
                                }
                                return false;

                              });
                              setRows(filterRows);

                            });
                          }
                        }}
                      >
                        <MenuItem value={1}>None</MenuItem>
                        {rolesArray.map((role) => (
                          <MenuItem value={role.name}>{role.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Filter by role</FormHelperText>
                    </FormControl>
                    <Button
                      className="InviteStaffButton"
                      variant="primary"
                      onClick={handleClickOpen}
                    >
                      Invite Staff Member
                    </Button>
                  </div>
                </Box>
                {/* Model popup to allow a business to invte a staff user  */}
                <div className="text-center">
                  <ThemeProvider theme={createTheme()}>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Staff Invitation
                      </DialogTitle>
                      <DialogContent>
                        <Formik
                          initialValues={initialValue}
                          validationSchema={validationSchema}
                          onSubmit={onSubmit}
                        >
                          {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            isValid,
                            errors,
                          }) => (
                            <form onSubmit={handleSubmit}>
                              <div>

                                <TextField
                                  autoComplete="off"
                                  id="staffFirstName"
                                  name="staffFirstName"
                                  label="First Name*"
                                  type="text"
                                  fullWidth
                                  margin="dense"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    handleChange(e);
                                    setCurrentFirstName(e.target.value);
                                  }}
                                  onBlur={handleBlur}

                                  value={values.staffFirstName}

                                  error={
                                    touched.staffFirstName &&
                                    Boolean(errors.staffFirstName)
                                  }
                                />
                                <ErrorMessage
                                  component="span"
                                  className="text-dangers"
                                  name="staffFirstName"
                                />

                              </div>

                              <TextField
                                autoComplete="off"
                                id="staffLastName"
                                name="staffLastName"
                                label="Last Name*"
                                type="text"
                                fullWidth
                                margin="dense"
                                onChange={(e) => {
                                  e.preventDefault();
                                  handleChange(e);
                                  setCurrentLastName(e.target.value);
                                }}
                                onBlur={handleBlur}
                                value={values.staffLasttName}
                                error={
                                  touched.staffLastName &&
                                  Boolean(errors.staffLastName)
                                }
                              />
                              <ErrorMessage
                                component="span"
                                className="text-dangers"
                                name="staffLastName"
                              />
                              <TextField
                                autoComplete="off"
                                id="staffEmail"
                                name="staffEmail"
                                label="Email*"
                                type="email"
                                fullWidth
                                margin="dense"
                                onChange={(e) => {
                                  e.preventDefault();
                                  handleChange(e);
                                  setCurrentEmail(e.target.value);
                                }}
                                onBlur={handleBlur}
                                value={values.staffEmail}
                                error={
                                  touched.staffEmail &&
                                  Boolean(errors.staffEmail)
                                }
                              />
                              <ErrorMessage
                                component="span"
                                className="text-dangers"
                                name="staffEmail"
                              />
                              <br />
                              <br />
                              <FormControl className="form-control">
                                <InputLabel id="demo-simple-select-helper-label">
                                  Role
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-helper-label"
                                  id="demo-simple-select-helper"
                                  name="roleId"

                                  onChange={(e) => {
                                    e.preventDefault();
                                    handleChange(e);
                                    setCurrentRoleName(e.target.value);
                                  }}
                                  onBlur={handleBlur}

                                  value={values.roleId}
                                  fullWidth
                                  MenuProps={MenuProps}

                                  error={
                                    touched.roleId &&
                                    Boolean(errors.roleId)
                                  }

                                >
                                  {/* Map through roles array */}
                                  {rolesArray.map((role) => (
                                    <MenuItem value={role.id}>
                                      {role.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <ErrorMessage
                                component="span"
                                className="text-dangers"
                                name="roleId"
                              />
                              <br />
                              <br />
                              <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                  Cancel
                                </Button>
                                <Button
                                  // If the form is valid, submit the form and close the model
                                  type="submit"
                                  disabled={!isValid}
                                  // If the form is invalid, disable invite button
                                  onClick={() => {
                                    if (isValid) {
                                      handleClose();
                                    }
                                  }}
                                  color="primary"
                                >
                                  Invite
                                </Button>
                              </DialogActions>
                            </form>
                          )}
                        </Formik>
                      </DialogContent>
                    </Dialog>
                  </ThemeProvider>
                </div>
                <br />
                {/* Display a UI table to show a staff's first, last, email, role, and actions column */}
                <div className="roster-table">
                  <Paper
                    sx={{ width: "100%", overflow: "hidden" }}
                    aria-label="customized table"
                  >
                    <TableContainer sx={{ maxHeight: 860 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <EnhancedTableHead
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          columns={columns}
                        />
                        <TableBody>
                          {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                setCurrentRowId(row.staffId);
                                                setCurrentFirstName(
                                                  row.staffFirstName
                                                );
                                                setCurrentLastName(
                                                  row.staffLastName
                                                );
                                                setCurrentEmail(row.staffEmail);
                                                setCurrentRoleName(row.role);
                                              }}
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
                                                BackdropProps={{ style: { opacity: "0.05" } }}
                                                PaperProps={{ style: { boxShadow: "none" } }}
                                              >
                                                <DialogTitle id="form-dialog-title">
                                                  Edit Staff
                                                </DialogTitle>
                                                <DialogContent>
                                                  <Formik
                                                    // Use initialValues to set the initial state of the form
                                                    initialValues={
                                                      initialValuesToUpdate
                                                    }
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
                                                      <form
                                                        onSubmit={handleSubmit}
                                                      >
                                                        <TextField
                                                          disabled
                                                          autoComplete="off"
                                                          id="staffFirstName"
                                                          name="staffFirstName"
                                                          label="First Name*"
                                                          type="text"
                                                          fullWidth
                                                          margin="dense"
                                                          onChange={
                                                            handleChange
                                                          }
                                                          onBlur={handleBlur}
                                                          value={
                                                            values.staffFirstName
                                                              ? values.staffFirstName
                                                              : CurrentFirstName
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          component="span"
                                                          className="text-dangers"
                                                          name="staffFirstName"
                                                        />
                                                        <TextField
                                                          disabled
                                                          autoComplete="off"
                                                          id="staffLastName"
                                                          name="staffLastName"
                                                          label="Last Name*"
                                                          type="text"
                                                          fullWidth
                                                          margin="dense"
                                                          onChange={
                                                            handleChange
                                                          }
                                                          onBlur={handleBlur}
                                                          value={
                                                            values.staffLastName
                                                              ? values.staffLastName
                                                              : CurrentLastName
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          component="span"
                                                          className="text-dangers"
                                                          name="staffLastName"
                                                        />
                                                        <TextField
                                                          disabled
                                                          autoComplete="off"
                                                          id="staffEmail"
                                                          name="staffEmail"
                                                          label="Email*"
                                                          type="email"
                                                          fullWidth
                                                          margin="dense"
                                                          onChange={
                                                            handleChange
                                                          }
                                                          onBlur={handleBlur}

                                                          value={
                                                            values.staffEmail
                                                              ? values.staffEmail
                                                              : CurrentEmail
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          component="span"
                                                          className="text-dangers"
                                                          name="staffEmail"
                                                        />
                                                        <br />
                                                        <br />
                                                        {/* Edit role */}
                                                        <FormControl className="form-control">
                                                          <InputLabel id="demo-simple-select-helper-label">
                                                            Role
                                                          </InputLabel>
                                                          <Select
                                                            labelId="demo-simple-select-helper-label"
                                                            id="demo-simple-select-helper"
                                                            name="roleId"
                                                            label="Role*"
                                                            onChange={handleChange}

                                                            onBlur={handleBlur}
                                                            value={
                                                              values.roleId
                                                                ? values.roleId
                                                                : CurrentRoleName
                                                            }
                                                            fullWidth

                                                            MenuProps={MenuProps}
                                                          >
                                                            {/* Map through roles array */}
                                                            {rolesArray.map((role) => (
                                                              <MenuItem
                                                                value={role.id}
                                                              >
                                                                {role.name}
                                                              </MenuItem>
                                                            ))}
                                                          </Select>
                                                        </FormControl>
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
                                                            onClick={() => {
                                                              updateStaff(
                                                                currentRowId,
                                                                values
                                                              );
                                                              handleCloseEdit();
                                                            }}
                                                            color="primary"
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
                                            <Button
                                              onClick={() => {
                                                terminateStaff(row.staffId);
                                              }}
                                              className="roster-button-2"
                                              variant="primary"
                                            >
                                              Delete
                                            </Button>
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
  );
}