import StatusLabel from '../../screens/providers/components/StatusLabel';
import React from 'react';

export const MicroFrontendFetchStatus = (props) => {
  if (props.status !== 'SUCCESS' && props.status !== 'LOADING') {
    return (
      <StatusLabel
        type="ERROR"
        label={props.label || 'Error loading micro frontend'}
      />
    );
  } else {
    return null;
  }
};
