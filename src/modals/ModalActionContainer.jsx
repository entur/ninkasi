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
import { connect } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import SuppliersActions from 'actions/SuppliersActions';
import Button from '@mui/material/Button';

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
      <Button
        variant="text"
        onClick={() => {
          this.closeModal();
        }}
      >
        Close
      </Button>,
    ];

    const selectStyle = {
      height: '100%',
      minHeight: '50vh',
      width: '96%',
      margin: 10,
    };

    const inputStyle = {
      width: '95%',
      margin: 10,
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
              const options = [];
              options.push(<option key={event.id}>{event.title}</option>);
              options.push(<option key={event.id + '-files'}>{'Files imported:'}</option>);
              const fileOptions = event.files.map((file, index) => (
                <option key={event.id + '-files' + index}>{file}</option>
              ));
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

const mapStateToProps = ({ UtilsReducer }) => ({
  isModalOpen: UtilsReducer.isModalOpen,
  filteredLoggedEvents: UtilsReducer.filteredLoggedEvents,
});

export default connect(mapStateToProps)(ModalActionContainer);
