import React from 'react';

const NoAccess = ({ username, handleLogout }) =>
  <div style={{ padding: 10, fontSize: 14 }}>
    <div>
      Your user <span style={{ fontStyle: 'italic' }}>{username} </span>
      has <span style={{ fontWeight: 600 }}> not </span> the necessary authorization to
      access this application.
    </div>
    <div
      style={{color: 'blue', marginTop: 10, cursor: 'pointer'}}
      onClick={() => handleLogout()}
    >
      Log out
    </div>
  </div>;


export default NoAccess;
