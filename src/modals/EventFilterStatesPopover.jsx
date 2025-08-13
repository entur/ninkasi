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
import { Checkbox, FormControlLabel } from '@mui/material';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class EventFilterStatesPopover extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    eventFilter: PropTypes.object.isRequired,
    enabled: PropTypes.bool.isRequired,
    allStates: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }

  handleOpen(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleCheckState(state, isChecked) {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.changeEventFilterState(index, state, isChecked));
  }

  render() {
    const { anchorEl, open } = this.state;
    const { enabled, eventFilter, allStates } = this.props;
    const states = eventFilter.states || [];

    return (
      <div>
        <Button
          variant="contained"
          disabled={!enabled}
          onClick={this.handleOpen.bind(this)}
          style={{ marginLeft: 10 }}
        >
          <span>
            States<span style={{ color: 'red' }}>*</span>
          </span>
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
          {allStates.map((state, i) => {
            const checked = states.indexOf(state) > -1;

            return (
              <MenuItem key={'state-' + i} style={{ fontSize: 12, minHeight: 18 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e, isChecked) => {
                        this.handleCheckState(state, isChecked);
                      }}
                    />
                  }
                  label={state}
                />
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default connect(null)(EventFilterStatesPopover);
