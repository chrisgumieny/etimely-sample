import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import '../../Css/roster.css';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Axios from "axios";
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from "../../Component/businessSidebar";
import EnhancedTableHead from "../../Component/sortTable";
import {isBusinessLoggedIn} from '../../Utils/Auth';
import NotLoggedIn from "../ErrorPages/notLoggedIn";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#0077ff',
      color: 'theme.palette.common.white',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));


// Create columns for First Name, Last Name, Email, and Actions
const columns = [
    { id: 'staffFirstName', label: 'First Name', minWidth: 100, align: "center" },
    { id: 'staffLastName', label: 'Last Name', minWidth: 100, align: "center" },
    { id: 'actions', label: 'Availabilities', minWidth: 80, align: "center" }
];


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
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



export default function TeamAvailability() {

    const [openEdit, setOpenEdit] = React.useState(false);

    // Dialog open and close
    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const staffName = {
        staffFirstName: "",
        staffLastName: "",
    }

    const [CurrentFirstName, setCurrentFirstName] = useState('');
    const [CurrentLastName, setCurrentLastName] = useState('');
    const [CurrentAvailabilities, setCurrentAvailabilities] = useState('');
    
    const navigate = useNavigate();

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
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };



    useEffect(() => {
        // If the user is logged in, get a list of staff and add them to the table
        if (isBusinessLoggedIn()) {
        const user = localStorage.getItem('Business user');
        const companyid = JSON.parse(user).companyId;
        fetch(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setRows(data);
            })
            .catch(err => console.log(err));
        }
         
        
    }, [navigate]);

    const getAvailabilityByStaffId = async (staffId) => {

        setCurrentAvailabilities("");
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
        const response = await Axios.get(`http://localhost:5001/etimely/availability/getAvailability/${staffId}`);

        if (response.data[0] !==  undefined)
        {
            // Only display the 7 most recent availabilities
            for(let i = 6; i >= 0; i--)
            {
                if (response.data[i])
                {
                    const availability = {
                        event_id: response.data[i].event_id,
                        start: new Date(response.data[i].startTime),
                        end: new Date(response.data[i].endTime)
                    }
                    // Format the availability into text that can be shown on the pop-up dialog
                    const availabilityFormat = {
                        text: (
                            <p>{monthNames[availability.start.getMonth()]}  {availability.start.getDate()}: {availability.start.toLocaleTimeString([], 
                            {hour: '2-digit', minute:'2-digit'})} to {availability.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                            <br></br></p>
                        )
                    };
                    // Push each availability into the current availabilities state
                    setCurrentAvailabilities(prev => [...prev, availabilityFormat.text]);
                }
            }
        }
        else
        {
            // If 0 availabilities are retrieved for a staff member, the current availabilities state will be updated to show that
            setCurrentAvailabilities("No availabilities");
        }
    }
     
    return (
        <>
        <div>
            {isBusinessLoggedIn() ? (
                <Box sx={{ display: 'flex' }}>
                <Sidebar/>
                  <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, width: { sm: 'calc(100% - 250px)' } }} >  
                  <div>
                    <br/><br/>
                    <h2>Team Availability</h2>
                    <p>View availabilities of staff members</p>
                    <br />              
    <Box>
        <div className="filter-options">
            <Box sx={{
                width: 300,
                maxWidth: '100%',
            }}className="box">
            <TextField fullWidth label="Search " id="fullWidth"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={(e) => {
                    // If the value in the search bar is invalid, show all staff
                    if (e.target.value === '' || e.target.value === undefined || e.target.value === null) {
                        const user = localStorage.getItem('Business user');
                        const companyid = JSON.parse(user).companyId;

                        Axios.get(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`).then(res => {
                            setRows(res.data);
                        }
                        )
                    }
                    // Show staff members that include the value being searched
                    else {
                        
                        const user = localStorage.getItem('Business user');
                        const companyid = JSON.parse(user).companyId;

                        const AllRows = Axios.get(`http://localhost:5001/etimely/business/getstaffByCompanyId/${companyid}`).then(res => {
                            const filterBy = ['staffFirstName', 'staffLastName', 'staffEmail'];
                            const filterRows = res.data.filter(row => {
                                for (let i = 0; i < filterBy.length; i++) {
                                    if (row[filterBy[i]].toLowerCase().includes(e.target.value.toLowerCase())) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            setRows(filterRows);
                        }
                        )
                    }
                }}

            />
            <FormHelperText>&nbsp;Search for a staff member</FormHelperText>
            </Box>
            </div>
            </Box>
            <br />
            <div className="roster-table">  
        <Paper sx={{ width: '85%', overflow: 'hidden' }} aria-label="customized table">
            <TableContainer sx={{ maxHeight: 860 }}>
                <Table stickyHeader aria-label="sticky table">
                <EnhancedTableHead
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          columns={columns}
                          />
                    <TableBody>
                        {/* For each row, add view material ui button */}
                        {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return (
                                <TableRow
                                    hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <StyledTableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                {/* Map through Actions and display a button */}
                                                {column.id === 'actions' ? (
                                                    <div>
                                                    <Button className="roster-button-1" variant="primary" onClick={() => {
                                                        getAvailabilityByStaffId(row.staffId);
                                                        handleClickOpenEdit();
                                                        setCurrentFirstName(row.staffFirstName);
                                                        setCurrentLastName(row.staffLastName);
                                                    }}>View</Button>&nbsp;&nbsp;
                                                    
                                                        <ThemeProvider theme={createTheme()}>
                                                    <Dialog
                                                        open={openEdit}
                                                        onClose={handleCloseEdit}
                                                        aria-labelledby="form-dialog-title"
                                                        BackdropProps={{ style: { opacity: "0.05" } }}
                                                        PaperProps={{ style: { boxShadow: "none" }}}
                                                    >
                                                        <DialogTitle id="form-dialog-title" 
                                                        sx={{
                                                            width: 1000,
                                                            maxWidth: '100%',
                                                        }}
                                                        >Recent Availability</DialogTitle>
                                                        <DialogContent initialValues={staffName}>
                                                            <Typography>
                                                                {CurrentFirstName} {CurrentLastName}
                                                            </Typography>
                                                            <DialogContent dividers>
                                                            <Typography>
                                                                {CurrentAvailabilities}
                                                            </Typography>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={handleCloseEdit} color="primary">
                                                                    Cancel
                                                                </Button>
                                                            </DialogActions>
                                                        </DialogContent>
                                                    </Dialog>
                                                    </ThemeProvider>
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