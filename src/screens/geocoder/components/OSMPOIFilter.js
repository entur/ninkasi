import React, { useState, useEffect } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import './OSMPOIFilter.scss';

import uuid from 'uuid/v4';

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
  const [poiFilterArray, setPoiFilterArray] = useState([
    { key: '', value: '' }
  ]);

  useEffect(() => {
    const url = window.config.poiFilterBaseUrl;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setPoiFilterArray(getPoiFilterArray(data.value));
      });
  }, []);

  const handleAddFilter = () => {
    const copy = poiFilterArray.slice();
    copy.push({ key: '', value: '' });
    setPoiFilterArray(copy);
  };

  const handleDeleteFilter = index => {
    const copy = poiFilterArray.slice();
    copy.splice(index, 1);
    setPoiFilterArray(copy);
  };

  const handleChange = (index, field, value) => {
    const copy = poiFilterArray.slice();
    const deepCopy = Object.assign({}, copy[index]);
    deepCopy[field] = value;
    copy[index] = deepCopy;
    setPoiFilterArray(copy);
  };

  const handleReset = () => {};
  const handleSubmit = () => {
    const poiFilterString = getPoiFilterString(poiFilterArray);

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
          .then(data => setPoiFilterArray(getPoiFilterArray(data.value)));
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="poi-filter-editor">
      {poiFilterArray &&
        poiFilterArray.map(({ key, value }, index) => (
          <div
            className="poi-filter-editor-row"
            key={`poi-filter-row_${index}`}
          >
            <TextField
              hintText="Key"
              floatingLabelText="Key"
              value={key}
              onChange={e => handleChange(index, 'key', e.target.value)}
            />

            <TextField
              hintText="Value"
              floatingLabelText="Value"
              value={value}
              onChange={e => handleChange(index, 'value', e.target.value)}
            />

            <FlatButton onClick={() => handleDeleteFilter(index)}>
              Delete
            </FlatButton>
          </div>
        ))}

      <div className="poi-filter-editor-row">
        <RaisedButton label="Add filter" onClick={handleAddFilter} />
        <RaisedButton label="Reset" onClick={handleReset} />
        <RaisedButton label="Submit" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default OSMPOIFilter;
