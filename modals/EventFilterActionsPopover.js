import React from 'react';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import Checkbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';


class EventFilterActionsPopover extends React.Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    eventFilter: PropTypes.object.isRequired,
    enabled: PropTypes.bool.isRequired,
    allActions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null
    }
  }

  handleCheckAction(action, isChecked) {
    const { index, dispatch } = this.props;
    dispatch(OrganizationRegisterActions.changeEventFilterAction(index, action, isChecked));
  }

  handleOpen(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  render() {
    const { anchorEl, open } = this.state;
    const { enabled, allActions, eventFilter } = this.props;
    const allActionsChecked = eventFilter.actions.indexOf('*') > -1

    return (
      <div>
        <RaisedButton
          disabled={!enabled}
          label="Actions"
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
            allActions[eventFilter.jobDomain].map( (action, i) => {

              //TODO: Map all values to plain English
              let actionLabel = action === '*' ? 'ALL' : action
              let checked = allActionsChecked ? true : eventFilter.actions.indexOf(action) > -1

              return (
                <Menu
                  key={"action-" + i}
                  menuItemStyle={{fontSize: 12, minHeight: 18}}
                >
                  <MenuItem>
                    <Checkbox
                      label={actionLabel}
                      checked={checked}
                      onCheck={(e, isChecked) => { this.handleCheckAction(action, isChecked) }}
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

export default connect(null)(EventFilterActionsPopover);