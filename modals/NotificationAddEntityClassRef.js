import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';


class NotificationAddEntityClassRef extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entityClassificationRefs: []
    }
  }

  getEntityClassificationsForType(entityType) {
    OrganizationRegisterActions.getEntityByClassification(entityType)
    .then( response => {
      this.setState({
        entityClassificationRefs: response.data
      })
    })
  }

  render() {

    const { entityTypes } = this.props;
    const { entityClassificationRefs } = this.state;

    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <SelectField
          hintText="Classification"
          floatingLabelText="Classification"
          onChange={ (e, i, v) => this.getEntityClassificationsForType(v)}
          fullWidth={true}
        >
          { entityTypes.map( entity => (
            <MenuItem key={entity.id} id={entity.id} value={entity.id} label={entity.name} primaryText={entity.name} />
          ))}
        </SelectField>
        <SelectField
          hintText="Type"
          floatingLabelText="Type"
          value={[]}
          onChange={ (e, i, v) => {}}
          fullWidth={true}
        >
          { entityClassificationRefs.map( type => (
            <MenuItem key={type.id} id={type.id} value={type.id} label={type.name} primaryText={type.name} />
          ))}
        </SelectField>
        <FlatButton
          label="Add"
          disabled={false}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  entityTypes: state.OrganizationReducer.entityTypes
})

export default connect(mapStateToProps)(NotificationAddEntityClassRef);