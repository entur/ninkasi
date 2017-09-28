import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import SuppliersActions from '../actions/SuppliersActions';
import FlatButton from 'material-ui/FlatButton';

class ModalActionContainer extends React.Component {
  handleFilterChange = event => {
    const { dispatch } = this.props;
    dispatch(SuppliersActions.logEventFilter(event.target.value));
  };

  closeModal() {
    this.props.dispatch(SuppliersActions.dismissModalDialog());
  }

  render() {

    const { isModalOpen, filteredLoggedEvents } = this.props;

    const actions = [
      <FlatButton
        label={"Close"}
        onClick={ () => { this.closeModal()}}
      />
    ];

    const selectStyle = {
      height: '100%',
      minHeight: '50vh',
      width: '96%',
      margin: 10
    };

    const inputStyle = {
      width: '95%',
      margin: 10
    };

    return (
      <Dialog
        actions={actions}
        open={isModalOpen}
        onRequestClose={() => this.closeModal()}
        title={'Logged events'}
      >
        <input
          onChange={this.handleFilterChange.bind(this)}
          style={inputStyle}
          type="text"
          placeholder="Filter"
        />
        <select style={selectStyle} multiple>
          {filteredLoggedEvents.map(event => {
            if (event.files && event.files.length) {
              let options = [];
              options.push(<option key={event.id}>{event.title}</option>);
              options.push(
                <option key={event.id + '-files'}>{'Files imported:'}</option>
              );
              let fileOptions = event.files.map((file, index) =>
                <option key={event.id + '-files' + index}>{file}</option>
              );
              options.push(fileOptions);

              return options;
            } else {
              return <option key={event.id}>{event.title}</option>;
            }
          })}
        </select>
      </Dialog>
    );
  }
}

const mapStateToProps = ({UtilsReducer}) => ({
  isModalOpen: UtilsReducer.isModalOpen,
  filteredLoggedEvents: UtilsReducer.filteredLoggedEvents
})

export default connect(mapStateToProps)(ModalActionContainer);
