import React, {Component} from 'react';

class OrganizationFilter extends Component {
  render() {

    const { organizations = [],
      handleOnChange,
      organisationFilterId
    } = this.props;

    const options = [{
      id: -1,
      value: -1,
      name: 'All organisations'
    }, ...organizations];

    return (
      <select
        style={{marginLeft: 5}}
        value={organisationFilterId}
        onChange={e => handleOnChange(e.target.value)}>
        { options.map(org =>
          <option
            value={org.id}
            key={org.id}>
            {org.name}
          </option>
        )}
      </select>
    );
  }
}


export default OrganizationFilter;
