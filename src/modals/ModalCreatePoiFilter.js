/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import Modal from "material-ui/Dialog";

import "./ModalCreatePoiFilter.scss";

import uuid from 'uuid/v4';

const getPoiFilterArray = poiFilterString => {
  const keyValues = poiFilterString.split(",");
  return keyValues.map(str => {
    const arr = str.split("=");
    return { key: arr[0], value: arr[1] };
  });
};

const getPoiFilterString = poiFilterArray => {
  const keyValues = poiFilterArray.map(({key, value}) => `${key.trim()}=${value.trim()}`);
  return keyValues.join(',');
};

const initialState = {
  poiFilterArray: [{ key: "", value: "" }]
};

class ModalCreatePoiFilter extends Component {
  token = localStorage.getItem("NINKASI::jwt");

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const url = window.config.poiFilterBaseUrl;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const poiFilterArray = getPoiFilterArray(data.value);
        this.setState({ poiFilterArray });
      });
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  handleSubmit() {
    const { poiFilterArray } = this.state;
    const poiFilterString = getPoiFilterString(poiFilterArray);

    const endpoint = window.config.poiFilterBaseUrl;
    fetch(endpoint, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
        'X-Correlation-Id': uuid()
      },
      body: JSON.stringify({ key: "poiFilter", value: poiFilterString })
    })
      .then(() => {
        const url = window.config.poiFilterBaseUrl;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            const poiFilterArray = getPoiFilterArray(data.value);
            this.setState({ poiFilterArray });
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleAddFilter = () => {
    const { poiFilterArray } = this.state;
    poiFilterArray.push({ key: "", value: "" });
    this.setState({ poiFilterArray });
  };

  handleDeleteFilter = index => {
    const { poiFilterArray } = this.state;
    poiFilterArray.splice(index, 1);
    this.setState({ poiFilterArray });
  };

  handleChange = (index, field, value) => {
    const { poiFilterArray } = this.state;
    poiFilterArray[index][field] = value;
    this.setState({ poiFilterArray });
  };

  render() {
    const { isModalOpen } = this.props;
    const { poiFilterArray } = this.state;

    const actions = [
      <FlatButton label="Close" onClick={this.handleOnClose.bind(this)} />,
      <FlatButton label="Update" onClick={this.handleSubmit.bind(this)} />
    ];

    console.log("poi: ", poiFilterArray);

    return (
      <Modal
        open={isModalOpen}
        actions={actions}
        contentStyle={{ width: "50%" }}
        title="Create a new poi filter"
        onRequestClose={() => this.handleOnClose()}
        autoScrollBodyContent
      >
        <div className="poi-filter-editor">
          {poiFilterArray &&
            poiFilterArray.map(({ key, value }, index) => (
              <div
                className="poi-filter-editor-row"
                key={`poi-filter-row_${index}`}
                // key={`poi-filter-row_${key}_${value}_${index}`}
              >
                <TextField
                  hintText="Key"
                  floatingLabelText="Key"
                  value={key}
                  onChange={e =>
                    this.handleChange(index, "key", e.target.value)
                  }
                />

                <TextField
                  hintText="Value"
                  floatingLabelText="Value"
                  value={value}
                  onChange={e =>
                    this.handleChange(index, "value", e.target.value)
                  }
                />

                <FlatButton onClick={() => this.handleDeleteFilter(index)}>
                  Delete
                </FlatButton>
              </div>
            ))}

          <div className="poi-filter-editor-row">
            <div />
            <FlatButton onClick={this.handleAddFilter}>Add filter</FlatButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalCreatePoiFilter;
