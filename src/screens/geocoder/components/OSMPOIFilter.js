import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from 'material-ui/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import uuid from 'uuid/v4';
import MdDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

import './OSMPOIFilter.scss';

const token = localStorage.getItem('NINKASI::jwt');

const getPoiFilterArray = poiFilterString => {
  const keyValues = poiFilterString.split(',');
  return keyValues.map(str => {
    const arr = str.split('=');
    return { key: arr[0], value: arr[1] };
  });
};

const getPoiFilterString = poiFilterArray => {
  const keyValues = poiFilterArray.map(
    ({ key, value }) => `${key.trim()}=${value.trim()}`
  );
  return keyValues.join(',');
};

const OSMPOIFilter = () => {
  const scrollRef = useRef(null);

  const [poiFilterArray, setPoiFilterArray] = useState([
    { key: '', value: '' }
  ]);
  const [dirtyPoiFilterArray, setDirtyPoiFilterArray] = useState(
    poiFilterArray
  );
  const [isDirty, setDirty] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = window.config.poiFilterBaseUrl;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setPoiFilterArray(getPoiFilterArray(data.value));
        setDirtyPoiFilterArray(getPoiFilterArray(data.value));
        setDirty(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [dirtyPoiFilterArray, scrollRef]);

  const handleAddFilter = () => {
    const copy = dirtyPoiFilterArray.slice();
    copy.push({ key: '', value: '' });
    setDirtyPoiFilterArray(copy);
    setDirty(true);
  };

  const handleDeleteFilter = index => {
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

  const handleSubmit = () => {
    const poiFilterString = getPoiFilterString(dirtyPoiFilterArray);

    const endpoint = window.config.poiFilterBaseUrl;
    fetch(endpoint, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'X-Correlation-Id': uuid()
      },
      body: JSON.stringify({ key: 'poiFilter', value: poiFilterString })
    })
      .then(() => {
        const url = window.config.poiFilterBaseUrl;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            setPoiFilterArray(getPoiFilterArray(data.value));
            setDirtyPoiFilterArray(getPoiFilterArray(data.value));
            setDirty(false);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid container justify="center" spacing={2}>
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
            disabled={isLoading || !isDirty}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Paper style={{ maxHeight: '70vh', overflow: 'auto', marginTop: '25px' }}>
        <Table size="small">
          <TableBody>
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              dirtyPoiFilterArray &&
              dirtyPoiFilterArray.map(({ key, value }, index) => (
                <TableRow key={`poi-filter-row_${index}`}>
                  <TableCell align="center" padding="none">
                    <TextField
                      hintText="Key"
                      value={key}
                      onChange={e => handleChange(index, 'key', e.target.value)}
                    />
                  </TableCell>
                  <TableCell align="center" padding="none">
                    <TextField
                      hintText="Value"
                      value={value}
                      onChange={e =>
                        handleChange(index, 'value', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="center" padding="none">
                    <IconButton onClick={() => handleDeleteFilter(index)}>
                      <MdDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            <div style={{ float: 'left', clear: 'both' }} ref={scrollRef}></div>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default OSMPOIFilter;
