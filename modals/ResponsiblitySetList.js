import React from 'react';
import MdRemove from 'material-ui/svg-icons/content/remove';
import MdAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';

class ResponsiblitySetList extends React.Component {

  getResponbilityNameById(id) {
    const { responsiblities } = this.props;
    for (let i = 0; responsiblities.length; i++) {
      if (responsiblities[i].id === id) {
        return responsiblities[i].name;
      }
    }
    return "N/A";
  }

  handleRemoveResponsibilitySet() {
    const { responsibilitySets } = this.refs;
    const index = responsibilitySets.options.selectedIndex;
    this.props.handleRemove(index);
  }

  render() {

    const { user, handleAdd } = this.props;

    return (
      <div style={{ width: '100%', fontSize: 12 }}>
        <div style={{ width: '100%', fontSize: 12 }}>
          Responsibility sets
        </div>
        <select
          multiple="multiple"
          style={{ width: '100%', fontSize: 12 }}
          ref="responsibilitySets"
        >
          {user.responsibilitySetRefs.map((rs, index) =>
            <option key={'ec-' + index}>{this.getResponbilityNameById(rs)} </option>
          )}
        </select>
        <div style={{ textAlign: 'left', width: '100%' }}>
          <IconButton
            onClick={handleAdd}
          >
            <MdAdd color="#228B22" />
          </IconButton>
          <IconButton
            onClick={this.handleRemoveResponsibilitySet.bind(this)}
          >
            <MdRemove color="#cc0000" />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default ResponsiblitySetList;