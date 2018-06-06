import React from 'react';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Checkbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';

class TransportModesPopover extends React.Component {

    static propTypes = {
        transportModes: PropTypes.array.isRequired,
        allTransportModes: PropTypes.array.isRequired,
        handleCheckTransportMode: PropTypes.func.isRequired
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

    render() {
        const { anchorEl, open } = this.state;
        const { allTransportModes, transportModes } = this.props;
        return (
            <div>

                <RaisedButton
                    label={<span>Generate service links for transport modes</span>}
                    onClick={this.handleOpen.bind(this)}
                    style={{marginLeft: 10}}
                />
                <Popover
                    anchorEl={anchorEl}
                    open={open}
                    onRequestClose={() => {
                        this.setState({open: false})
                    }}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    animation={PopoverAnimationVertical}>
                    {
                        allTransportModes.map((transportMode, i) => {
                            let checked = transportModes.indexOf(transportMode) > -1
                            return (
                                <Menu
                                    key={"action-" + i}
                                    menuItemStyle={{fontSize: 12, minHeight: 18}}
                                >
                                    <MenuItem>
                                        <Checkbox
                                            label={transportMode}
                                            checked={checked}
                                            onCheck={(e, isChecked) => { this.props.handleCheckTransportMode(transportMode, isChecked);}}
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

export default connect(null)(TransportModesPopover);