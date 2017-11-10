import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class UserRespSetPopover extends Component {
  render() {
    const {
      handleAdd,
      handleClose,
      anchorEl,
      open,
      responsibilities = [],
      addedRespSets
    } = this.props;


    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onRequestClose={handleClose}
      >
        <Menu
          maxHeight="500"
        >
          {responsibilities
            .filter(r => r.id)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(r =>
              <MenuItem
                style={{fontSize: '0.9em'}}
                key={r.id}
                id={r.id}
                value={r.id}
                label={r.name}
                primaryText={r.name}
                disabled={addedRespSets.indexOf(r.id) > -1}
                onClick={() => { handleAdd(r.id)}}
              />
            )}
        </Menu>
      </Popover>
    );
  }
}

export default UserRespSetPopover;
