import React from "react"
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import TableCell from "@mui/material/TableCell";


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


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  
  
export default function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, columns } = props;
      
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
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
                    sortDirection={orderBy === column.id ? order : false}
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={createSortHandler(column.id)}
                  >
                    {column.label}
                    {orderBy === column.id ? (
                      <span className={order === "desc" ? "desc" : "asc"}>
                        {order === "desc" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                      </span>
                    ) : null}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
  };