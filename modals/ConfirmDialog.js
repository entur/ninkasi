import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ConfirmDialog extends Component {

  handleSubmit() {
    const { handleSubmit, handleClose } = this.props;
    handleClose();
    handleSubmit();
  }

  render() {

    const { handleClose, open, title, info } = this.props;

    const actions = [
      <FlatButton
        label={"Close"}
        onClick={() => { handleClose() }}
      />,
      <FlatButton
        label={"Confirm"}
        onClick={this.handleSubmit.bind(this)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        title={title}
        open={open}
      >
        <p>{info}</p>
      </Dialog>
    );
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func,
  title: PropTypes.string,
  info: PropTypes.string
};

export default ConfirmDialog;

