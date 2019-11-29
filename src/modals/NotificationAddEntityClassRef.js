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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';

class NotificationAddEntityClassRef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityClassificationRefs: [],
      entityType: props.entityTypes[0].id,
      entityClasRefSelected: null
    };
  }

  getEntityClassificationsForType(entityType) {
    OrganizationRegisterActions.getEntityByClassification(entityType).then(
      response => {
        this.setState({
          entityClassificationRefs: response.data,
          entityType
        });
      }
    );
  }

  handleAdd() {
    const { entityClasRefSelected } = this.state;
    const { index, dispatch } = this.props;
    if (entityClasRefSelected !== null) {
      dispatch(
        OrganizationRegisterActions.addEntityRefToNotification(
          index,
          entityClasRefSelected
        )
      );
    }
  }

  componentDidMount() {
    this.getEntityClassificationsForType(this.state.entityType);
  }

  render() {
    const { entityTypes } = this.props;
    const { entityClassificationRefs, entityType } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        <SelectField
          hintText="Classification"
          floatingLabelText="Classification"
          value={entityType}
          onChange={(e, i, v) => this.getEntityClassificationsForType(v)}
          fullWidth={true}
        >
          {entityTypes.map(entity => (
            <MenuItem
              key={entity.id}
              id={entity.id}
              value={entity.id}
              label={entity.name}
              primaryText={entity.name}
            />
          ))}
        </SelectField>
        <SelectField
          hintText="Type"
          floatingLabelText="Type"
          value={this.state.entityClasRefSelected}
          onChange={(e, i, v) => {
            this.setState({ entityClasRefSelected: v });
          }}
          style={{ marginLeft: 5 }}
          fullWidth={true}
        >
          {entityClassificationRefs.map(type => (
            <MenuItem
              key={type.id}
              id={type.id}
              value={type.id}
              label={type.name}
              primaryText={type.name}
            />
          ))}
        </SelectField>
        <FlatButton
          label="Add"
          onClick={this.handleAdd.bind(this)}
          disabled={!this.state.entityClasRefSelected}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entityTypes: state.OrganizationReducer.entityTypes
});

export default connect(mapStateToProps)(NotificationAddEntityClassRef);
