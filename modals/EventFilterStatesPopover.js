import React from 'react';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Checkbox from 'material-ui/Checkbox';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import PropTypes from 'prop-types';

class EventFilterStatesPopover extends React.Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    eventFilter: PropTypes.object.isRequired,
    enabled: PropTypes.bool.isRequired,
    allStates: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null
    }
  }

  handleOpen(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
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
        <RaisedButton
          disabled={!enabled}
          label={<span>States<span style={{color: 'red'}}>*</span></span>}
          onClick={this.handleOpen.bind(this)}
        />
        <Popover
          anchorEl={anchorEl}
          open={open}
          onRequestClose={() => { this.setState({open: false})}}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          animation={PopoverAnimationVertical}        >
          {
            allStates.map( (state, i) => {

              let checked = states.indexOf(state) > -1

              return (
                <Menu
                  key={"action-" + i}
                  menuItemStyle={{fontSize: 12, minHeight: 18}}
                >
                  <MenuItem>
                    <Checkbox
                      label={state}
                      checked={checked}
                      onCheck={(e, isChecked) => { this.handleCheckState(state, isChecked) }}
                    />
                  </MenuItem>
                </Menu>
              )
            })
          }
        </Popover>
      </div>
    )
  }
}

export default connect(null)(EventFilterStatesPopover);