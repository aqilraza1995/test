
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { FC } from "react";


interface Column {
  id: string;
  label: string;
  render?: (item: unknown, index: number) => React.ReactNode; 
}

type RowData = Record<string, string | number | React.ReactNode>; 

interface TableProps {
  columns: Column[];
  rows: RowData[]; 
}

const CustomTable: FC<TableProps> = ({columns, rows})=>{
    return(
        <>
        <TableContainer >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns?.map((item, index)=>(
                <TableCell key={index}>{item?.label}</TableCell>
            ))}
            
          </TableRow>
        </TableHead>
        <TableBody>
            {rows?.length ? 
            rows?.map((item, index)=>(
                <TableRow>
                    {columns?.map((cell, i)=>(
                        <TableCell key={i}>{cell?.render ? cell?.render(item, index): item[cell?.id]}</TableCell>
                    ))}
                </TableRow>
            ))
        :
        <TableRow><TableCell colSpan={columns?.length} align="center">No Record Found</TableCell></TableRow>
        }
          
        </TableBody>
      </Table>
    </TableContainer>

        </>
    )
}

export default CustomTable