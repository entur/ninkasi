import { useState, type ReactElement } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { SEVERITY } from '../model/ValidationReport';

type ExpandableReportRowProps = {
  values: string[];
  children: ReactElement;
  severity?: SEVERITY;
};

export const ExpandableReportRow = ({ values, children, severity }: ExpandableReportRowProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        onClick={() => setOpen(!open)}
        sx={{
          cursor: 'pointer',
          backgroundColor: severity === SEVERITY.CRITICAL ? '#ffcece' : 'transparent',
          '& > *': { borderBottom: 'unset' },
        }}
      >
        <TableCell padding="checkbox">
          <IconButton
            size="small"
            aria-label="expand row"
            onClick={event => {
              event.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        {values.map((value, i) => (
          <TableCell key={`${i}-${value}`}>{value}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={values.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
