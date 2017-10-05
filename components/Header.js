import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MdAccount from 'material-ui/svg-icons/action/account-circle';
import { connect } from 'react-redux';
import MdHistory from 'material-ui/svg-icons/action/history';
import SuppliersActions from '../actions/SuppliersActions';
import { getProvidersEnv, getTheme } from '../config/themes';

class Header extends React.Component {
  handleLogout() {
    const { kc } = this.props;
    if (kc) {
      kc.logout();
    }
  }

  handleShowHistory() {
    this.props.dispatch(SuppliersActions.openHistoryModal());
  }

  getUsername() {
    const { kc } = this.props;
    if (kc && kc.tokenParsed) {
      return kc.tokenParsed.preferred_username || 'N/A';
    }
  }

  render() {
    const providersEnv = getProvidersEnv(window.config.providersBaseUrl);

    const backgroundStyle = {
      height: 60,
      ...getTheme(providersEnv)
    };

    const username = this.getUsername();
    return (
      <AppBar
        style={backgroundStyle}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '1em' }}>Ninkasi</div>
              {providersEnv !== 'PROD' &&
                <div
                  style={{
                    marginLeft: 5,
                    fontSize: '0.4em',
                    lineHeight: '5em'
                  }}
                >
                  {providersEnv}
                </div>}
            </div>
            <div
              style={{
                marginLeft: 5,
                fontSize: '0.4em',
                marginTop: 5,
                fontWeight: 400
              }}
            >
              v{process.env.VERSION}
            </div>
          </div>
        }
        iconElementRight={
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <MenuItem
              primaryText={'History'}
              leftIcon={<MdHistory color="#41c0c4" />}
              style={{ fontSize: 12, padding: 0 }}
              onClick={() => {
                this.handleShowHistory();
              }}
            />
            <MenuItem
              leftIcon={<MdAccount color="#41c0c4" />}
              primaryText={`Log out ${username}`}
              onClick={() => {
                this.handleLogout();
              }}
              style={{ fontSize: 12, padding: 0 }}
            />
          </IconMenu>
        }
      />
    );
  }
}

const mapStateToProps = ({ UserReducer }) => ({
  kc: UserReducer.kc
});

export default connect(mapStateToProps)(Header);
