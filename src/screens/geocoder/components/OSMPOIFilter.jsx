import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useAuth } from 'react-oidc-context';
import getApiConfig from 'actions/getApiConfig';
import './OSMPOIFilter.scss';

const sort = (data) => {
  return data.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else if (a.id < b.id) {
      return -1;
    }
    return 0;
  });
};

const OSMPOIFilter = () => {
  const auth = useAuth();

  const scrollRef = useRef(null);

  const [poiFilterArray, setPoiFilterArray] = useState([
    { key: '', value: '' },
  ]);
  const [dirtyPoiFilterArray, setDirtyPoiFilterArray] =
    useState(poiFilterArray);
  const [isDirty, setDirty] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleResponse = (data) => {
    setPoiFilterArray(data);
    setDirtyPoiFilterArray(data);
    setDirty(false);
    setLoading(false);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      const config = await getApiConfig(() => auth.user?.access_token);
      setLoading(true);
      const url = window.config.poiFilterBaseUrl;
      axios
        .get(url, config)
        .then((response) => response.data)
        .then(sort)
        .then(handleResponse);
    };

    fetchFilters();
  }, [auth]);

  useEffect(() => {
    if (!dirtyPoiFilterArray[dirtyPoiFilterArray.length - 1].id) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dirtyPoiFilterArray, scrollRef]);

  const handleAddFilter = () => {
    const copy = dirtyPoiFilterArray.slice();
    copy.push({ key: '', value: '' });
    setDirtyPoiFilterArray(copy);
    setDirty(true);
  };

  const handleDeleteFilter = (index) => {
    const copy = dirtyPoiFilterArray.slice();
    copy.splice(index, 1);
    setDirtyPoiFilterArray(copy);
    setDirty(true);
  };

  const handleChange = (index, field, value) => {
    const copy = dirtyPoiFilterArray.slice();
    const deepCopy = Object.assign({}, copy[index]);
    deepCopy[field] = value;
    copy[index] = deepCopy;
    setDirtyPoiFilterArray(copy);
    setDirty(true);
  };

  const handleReset = () => {
    setDirtyPoiFilterArray(poiFilterArray);
    setDirty(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const endpoint = window.config.poiFilterBaseUrl;
    const config = await getApiConfig(() => auth.user?.access_token);
    axios
      .put(endpoint, JSON.stringify(dirtyPoiFilterArray), config)
      .then(() => {
        const url = window.config.poiFilterBaseUrl;
        axios
          .get(url, config)
          .then((response) => response.data)
          .then(sort)
          .then(handleResponse);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={handleAddFilter}
          >
            Add filter
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={isLoading || !isDirty}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={
              isLoading ||
              !isDirty ||
              dirtyPoiFilterArray.some((filter) => filter.priority < 1)
            }
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Paper style={{ maxHeight: '70vh', overflow: 'auto', marginTop: '25px' }}>
        <Alert severity="warning">
          The priority field is experimental. Setting priority level above 10
          could lead to unexpected boosting in the geocoder.
        </Alert>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Key
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Value
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Priority
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? [...Array(10).keys()].map((i) => (
                  <TableRow key={`skeleton-row_${i}`}>
                    {[...Array(4).keys()].map((j) => (
                      <TableCell key={`skeleton-cell_${j}`}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : dirtyPoiFilterArray &&
                dirtyPoiFilterArray.map(({ key, value, priority }, index) => (
                  <TableRow key={`poi-filter-row_${index}`} sx={{ height: 80 }}>
                    <TableCell
                      align="center"
                      sx={{ p: 1, verticalAlign: 'middle' }}
                    >
                      <TextField
                        label="Key"
                        placeholder="Enter key"
                        value={key}
                        onChange={(e) =>
                          handleChange(index, 'key', e.target.value)
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ p: 1, verticalAlign: 'middle' }}
                    >
                      <TextField
                        label="Value"
                        placeholder="Enter value"
                        value={value}
                        onChange={(e) =>
                          handleChange(index, 'value', e.target.value)
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ p: 1, verticalAlign: 'middle' }}
                    >
                      <TextField
                        type="number"
                        label="Priority"
                        placeholder="Enter priority"
                        value={priority}
                        inputProps={{ min: 1 }}
                        onChange={(e) =>
                          handleChange(
                            index,
                            'priority',
                            parseInt(e.target.value, 10),
                          )
                        }
                        error={priority < 1}
                        helperText={
                          priority < 1 ? 'Priority must be 1 or more' : ''
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ p: 1, verticalAlign: 'middle' }}
                    >
                      <IconButton
                        onClick={() => handleDeleteFilter(index)}
                        size="large"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            <div style={{ float: 'left', clear: 'both' }} ref={scrollRef}></div>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default OSMPOIFilter;
