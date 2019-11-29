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
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

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
      <Popover open={open} anchorEl={anchorEl} onRequestClose={handleClose}>
        <Menu maxHeight="500">
          {responsibilities
            .filter(r => r.id)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(r => (
              <MenuItem
                style={{ fontSize: "0.9em" }}
                key={r.id}
                id={r.id}
                value={r.id}
                label={r.name}
                primaryText={r.name}
                disabled={addedRespSets.indexOf(r.id) > -1}
                onClick={() => {
                  handleAdd(r.id);
                }}
              />
            ))}
        </Menu>
      </Popover>
    );
  }
}

export default UserRespSetPopover;
