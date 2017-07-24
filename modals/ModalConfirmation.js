import React from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

class ConfirmationDialog extends React.Component {

  static PropTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.props.handleSubmit}
      />
    ];

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        {this.props.body}
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
