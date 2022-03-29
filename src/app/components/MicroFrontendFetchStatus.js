import StatusLabel from '../../screens/providers/components/StatusLabel';
import React from 'react';

export const MicroFrontendFetchStatus = props => {
  if (props.status !== 'SUCCESS' && props.status !== 'LOADING') {
    return (
      <StatusLabel
        type="ERROR"
        label="Error loading NeTEx validation reports"
      />
    );
  } else {
    return null;
  }
};
