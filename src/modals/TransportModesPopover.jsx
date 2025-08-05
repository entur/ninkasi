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

import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';

export default class TransportModesPopover extends React.Component {
  static propTypes = {
    transportModes: PropTypes.array.isRequired,
    allTransportModes: PropTypes.array.isRequired,
    handleCheckTransportMode: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null
    };
  }

  handleOpen(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  render() {
    const { anchorEl, open } = this.state;
    const { allTransportModes, transportModes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          onClick={this.handleOpen.bind(this)}
          style={{ marginLeft: 10 }}
        >
          <span>Generate service links for transport modes</span>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => {
            this.setState({ open: false });
          }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          {allTransportModes.map((transportMode, i) => {
            let checked = transportModes.indexOf(transportMode) > -1;
            return (
              <Menu
                key={'action-' + i}
                menuItemStyle={{ fontSize: 12, minHeight: 18 }}
              >
                <MenuItem>
                  <Checkbox
                    label={transportMode}
                    checked={checked}
                    onCheck={(e, isChecked) => {
                      this.props.handleCheckTransportMode(
                        transportMode,
                        isChecked
                      );
                    }}
                  />
                </MenuItem>
              </Menu>
            );
          })}
        </Menu>
      </div>
    );
  }
}
