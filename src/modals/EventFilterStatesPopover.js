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

import React from "react";
import { connect } from "react-redux";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import Popover, { PopoverAnimationVertical } from "material-ui/Popover";
import Checkbox from "material-ui/Checkbox";
import OrganizationRegisterActions from "../actions/OrganizationRegisterActions";
import PropTypes from "prop-types";

class EventFilterStatesPopover extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    eventFilter: PropTypes.object.isRequired,
    enabled: PropTypes.bool.isRequired,
    allStates: PropTypes.array.isRequired
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

  handleCheckState(state, isChecked) {
    const { index, dispatch } = this.props;
    dispatch(
      OrganizationRegisterActions.changeEventFilterState(
        index,
        state,
        isChecked
      )
    );
  }

  render() {
    const { anchorEl, open } = this.state;
    const { enabled, eventFilter, allStates } = this.props;
    const states = eventFilter.states || [];

    return (
      <div>
        <RaisedButton
          disabled={!enabled}
          label={
            <span>
              States<span style={{ color: "red" }}>*</span>
            </span>
          }
          onClick={this.handleOpen.bind(this)}
          style={{ marginLeft: 10 }}
        />
        <Popover
          anchorEl={anchorEl}
          open={open}
          onRequestClose={() => {
            this.setState({ open: false });
          }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          animation={PopoverAnimationVertical}
        >
          {allStates.map((state, i) => {
            let checked = states.indexOf(state) > -1;

            return (
              <Menu
                key={"action-" + i}
                menuItemStyle={{ fontSize: 12, minHeight: 18 }}
              >
                <MenuItem>
                  <Checkbox
                    label={state}
                    checked={checked}
                    onCheck={(e, isChecked) => {
                      this.handleCheckState(state, isChecked);
                    }}
                  />
                </MenuItem>
              </Menu>
            );
          })}
        </Popover>
      </div>
    );
  }
}

export default connect(null)(EventFilterStatesPopover);
