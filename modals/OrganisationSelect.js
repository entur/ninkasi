import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

class OrganisationSelect extends React.Component {
  static propTypes = {
    organizations: PropTypes.array.isRequired,
    notification: PropTypes.object.isRequired,
    handleChangeOrganization: PropTypes.func.isRequired
  };

  render() {
    const {
      organizations,
      notification,
      handleChangeOrganization
    } = this.props;

    return (
      <SelectField
        hintText="Organization only"
        floatingLabelText="Organization only"
        style={{marginLeft: 10, flex: 1}}
        value={notification.eventFilter.organisationRef}
        onChange={(e, index, value) => {
          handleChangeOrganization(value);
        }}
      >
        {organizations.map(org =>
          <MenuItem
            key={org.id}
            id={org.id}
            value={org.id}
            label={org.name}
            primaryText={org.name}
          />
        )}
      </SelectField>
    );
  }
}

export default OrganisationSelect;
