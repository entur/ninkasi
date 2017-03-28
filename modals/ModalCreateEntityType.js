import React, { Component, PropTypes } from 'react'
import Modal from './Modal'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import MdRemove from 'material-ui/svg-icons/content/remove'
import MdAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'

const initialState = {
  entityType: {
    name: '',
    privateCode: '',
    codeSpace: '',
    classifications: [],
  },
  isCreatingNewClassification: false,
  tempClassification: {
    name: '',
    privateCode: '',
  }
}

class ModalCreateEntityType extends React.Component {

  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentWillUnmount() {
    this.state = initialState
  }


  handleOnClose() {
    this.setState(initialState)
    this.props.handleCloseModal()
  }

  getClassificationTitle = classification => {
    return `name=${classification.name}, privateCode=${classification.privateCode}`
  }

  handleAddClassification() {
    const { entityType, tempClassification } = this.state
    this.setState({
      ...this.state,
      isCreatingNewClassification: false,
      entityType: {
        ...entityType,
        classifications: [...entityType.classifications, tempClassification],
      },
      tempClassification: {
        name: '',
        privateCode: '',
      }
    })
  }

  handleRemoveClassification() {
    const { classifications } = this.refs
    const index = classifications.options.selectedIndex

    if (index > -1) {
      this.setState({
        entityType: {
          ...this.state.entityType,
          classifications: [
            ...this.state.entityType.classifications.slice(0, index),
            ...this.state.entityType.classifications.slice(index + 1)
          ]
        }
      })
    }
  }

  render() {

    const { isModalOpen, handleSubmit, takenPrivateCodes, codeSpaces } = this.props

    const { entityType, isCreatingNewClassification, tempClassification } = this.state

    const titleStyle = {
      fontSize: '2em',
      fontWeight: 600,
      margin: '10px auto',
      width: '80%',
    }

    const invalidPrivateCode = takenPrivateCodes.indexOf(entityType.privateCode) > -1
    const isClassificationPrivateCodeTaken = entityType.classifications.map( c => c.privateCode ).indexOf(tempClassification.privateCode) > -1
    const isSavable = !invalidPrivateCode && (entityType.name.length && entityType.codeSpace.length && entityType.privateCode.length)

    return (
      <Modal isOpen={isModalOpen} onClose={() => this.handleOnClose()} minWidth="35vw" minHeight="auto">
        <div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={titleStyle}>Creating a new entity type</div>
            <MdClose style={{marginRight: 10, cursor: 'pointer'}} onClick={() => this.handleOnClose()}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', marginTop: '20px'}}>
              <TextField
                hintText="Name"
                floatingLabelText="Name"
                value={entityType.name}
                onChange={ (e, value) => this.setState({
                  entityType: { ...entityType, name: value }
                })}
                fullWidth={true}
                style={{marginTop: -25}}
              />
              <TextField
                hintText="private code"
                floatingLabelText="Private code"
                errorText={invalidPrivateCode ? 'Private code already exists' : ''}
                value={entityType.privateCode}
                onChange={ (e, value) => this.setState({
                  entityType: { ...entityType, privateCode: value }
                })}
                fullWidth={true}
                errorStyle={{float: 'right'}}
                style={{marginTop: -15}}
              />
              <SelectField
                hintText="Code space"
                floatingLabelText="Code space"
                value={entityType.codeSpace}
                onChange={ (e, index, value) => this.setState({
                  entityType: { ...entityType, codeSpace: value }
                })}
                fullWidth={true}
                style={{marginTop: -10}}
              >
                { codeSpaces.map( codeSpace => (
                  <MenuItem key={codeSpace.id} id={codeSpace.id} value={codeSpace.id} label={codeSpace.id} primaryText={codeSpace.xmlns} />
                ))}
              </SelectField>
              <div style={{width: '100%', fontSize: 12}}>Entity classifications</div>
              <select multiple="multiple" style={{width: '100%', fontSize: 12}} ref="classifications">
                { entityType.classifications.map( (et, index) => (
                  <option key={'ec-' + index}>{ this.getClassificationTitle(et) } </option> ))
                }
              </select>
              <div style={{textAlign: 'left', width: '100%'}}>
                <IconButton
                  onClick={() => this.setState({isCreatingNewClassification: true})}
                >
                  <MdAdd color="#228B22"/>
                </IconButton>
                <IconButton
                  onClick={this.handleRemoveClassification.bind(this)}
                >
                  <MdRemove color="#cc0000"/>
                </IconButton>
              </div>
              { isCreatingNewClassification
                ? <div style={{border: '1px dotted', width: '100%'}}>
                  <div style={{fontSize: 12, textAlign: 'center', fontWeight: 600}}>New classification</div>
                  <TextField
                    hintText="Name"
                    floatingLabelText="Name"
                    value={tempClassification.name}
                    onChange={ (e, value) => this.setState({
                      tempClassification: { ...tempClassification, name: value }
                    })}
                    fullWidth={true}
                    style={{marginTop: -15, width: '98%'}}
                  />
                  <TextField
                    hintText="Private code"
                    floatingLabelText="Private code"
                    errorStyle={{float: 'right'}}
                    errorText={isClassificationPrivateCodeTaken ?  'Private code is already taken' : ''}
                    onChange={ (e, value) => this.setState({
                      tempClassification: { ...tempClassification, privateCode: value }
                    })}
                    value={tempClassification.privateCode}
                    fullWidth={true}
                    style={{marginTop: -15, width: '98%'}}
                  />
                  <FlatButton
                    label="Add"
                    style={{width: '100%'}}
                    disabled={isClassificationPrivateCodeTaken || (!tempClassification.name.length || !tempClassification.privateCode.length) }
                    onClick={this.handleAddClassification.bind(this)}
                  />
                </div>
                : null
              }
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginRight: 15}}>
            <div style={{fontSize: 12, marginLeft: 15}}></div>
            <RaisedButton
              disabled={!isSavable}
              label="Create" primary={true}
              onClick={ () => handleSubmit(entityType)}
            />
          </div>
        </div>
      </Modal>
    )
  }

}


export default ModalCreateEntityType
