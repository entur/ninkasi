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

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withAuth from 'utils/withAuth';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import peliasTasks from 'config/peliasTasks';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import SuppliersActions from 'actions/SuppliersActions';
import ConfirmDialog from 'modals/ConfirmDialog';

const initialPeliasOptions = () => {
  let tasks = {};
  peliasTasks.forEach(option => (tasks[option.task] = true));
  return tasks;
};

const getLabelByJobType = type => {
  for (let i = 0; i < peliasTasks.length; i++) {
    if (peliasTasks[i].task === type) return peliasTasks[i].label;
  }
};

const getColorByStatus = status => {
  switch (status) {
    case 'STARTED':
      return '#08920e';
    case 'OK':
      return '#08920e';
    case 'FAILED':
      return '#990000';
    default:
      return 'grey';
  }
};

const Pelias = ({ otherStatus, dispatch, getToken }) => {
  const [peliasOptions, setPeliasOptions] = useState(initialPeliasOptions());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(SuppliersActions.getGraphStatus(getToken));
  }, [dispatch, getToken]);

  const handlePeliasOptionChecked = (event, task) => {
    setPeliasOptions(
      Object.assign({}, peliasOptions, {
        [task]: event.target.checked
      })
    );
  };

  const handleExecutePelias = () => {
    setConfirmDialogOpen(true);
  };

  const confirmExecutePelias = () => {
    setConfirmDialogOpen(false);
    dispatch(SuppliersActions.executePeliasTask(peliasOptions));
  };

  return (
    <div>
      {peliasTasks.map(option => (
        <Checkbox
          key={'pelias-checkbox-' + option.task}
          label={option.label}
          onCheck={e => handlePeliasOptionChecked(e, option.task)}
          defaultChecked={true}
          labelPosition="right"
          style={{ marginTop: 5, marginBottom: 5 }}
        />
      ))}
      <Divider
        key={'pelias-divider1'}
        style={{ marginTop: 10, marginBottom: 5 }}
      />
      <div
        key={'pelias-options-status-wrapper'}
        style={{ display: 'flex', flexDirection: 'column', padding: 5 }}
      >
        <span style={{ fontWeight: 600 }}>Status</span>
        {otherStatus.map((status, index) => (
          <div
            key={'jobtype-status' + index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              background: index % 2 ? '#F8F8F8' : '#fff'
            }}
          >
            <div style={{ marginLeft: 5, flex: 9, fontSize: '0.9em' }}>
              {getLabelByJobType(status.type)}
            </div>
            <div style={{ fontSize: '0.9em', flex: 6 }}>
              {moment(status.started).format('LLLL')}
            </div>
            <div
              style={{
                marginLeft: 5,
                flex: 2,
                color: getColorByStatus(status.status)
              }}
            >
              {status.status}
            </div>
          </div>
        ))}
      </div>
      <Divider
        key={'pelias-divider2'}
        style={{ marginTop: 10, marginBottom: 10 }}
      />
      <div
        key={'pelias-buttons'}
        style={{ width: '100%', textAlign: 'center' }}
      >
        <RaisedButton
          primary={true}
          labelStyle={{ fontSize: 12 }}
          onClick={() => handleExecutePelias()}
          disabled={Object.values(peliasOptions).every(value => !value)}
          label={'Execute'}
        />
      </div>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleSubmit={confirmExecutePelias}
        title="Execute Pelias tasks"
        info="Are you sure you want to execute selected pelias tasks?"
        handleClose={() => {
          setConfirmDialogOpen(false);
        }}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  otherStatus: state.SuppliersReducer.otherStatus || []
});

export default connect(mapStateToProps)(withAuth(Pelias));
