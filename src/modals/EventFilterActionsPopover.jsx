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
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class EventFilterActionsPopover extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    eventFilter: PropTypes.object.isRequired,
    enabled: PropTypes.bool.isRequired,
    allActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null
    };
  }

  handleCheckAction(action, isChecked) {
    const { index, dispatch } = this.props;
    dispatch(
      OrganizationRegisterActions.changeEventFilterAction(
        index,
        action,
        isChecked
      )
    );
  }

  handleOpen(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  render() {
    const { anchorEl, open } = this.state;
    const { enabled, allActions, eventFilter } = this.props;

    const actions = eventFilter.actions || [];

    const allActionsChecked = actions.indexOf('*') > -1;

    return (
      <div>
        <Button
          variant="contained"
          disabled={!enabled && !eventFilter.jobDomain}
          onClick={this.handleOpen.bind(this)}
        >
          <span>
            Actions<span style={{ color: 'red' }}>*</span>
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
          {eventFilter.jobDomain &&
            allActions[eventFilter.jobDomain].map((action, i) => {
              //TODO: Map all values to plain English
              let actionLabel = action === '*' ? 'ALL' : action;
              let checked = allActionsChecked
                ? true
                : actions.indexOf(action) > -1;

              return (
                <MenuItem
                  key={'action-' + i}
                  style={{ fontSize: 12, minHeight: 18 }}
                >
                  <Checkbox
                    checked={checked}
                    onChange={(e, isChecked) => {
                      this.handleCheckAction(action, isChecked);
                    }}
                  />
                  {actionLabel}
                </MenuItem>
              );
            })}
        </Menu>
      </div>
    );
  }
}

export default connect(null)(EventFilterActionsPopover);
