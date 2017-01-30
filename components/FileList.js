import React from 'react'

class FileList extends React.Component {

  render() {

    const { props } = this

    return (
      <select ref={props.wrapperId} style={{flex: 3}} id={props.wrapperId} multiple className="multiselect">
        { props.files.map((file,index) => (
          <option
            key={ props.wrapperId + index }
            onClick={(e) => { props.handleSelectFileToDownload && props.handleSelectFileToDownload(e.target.value) }}>
            { file }
          </option> )
        )}
      </select>
    )
  }
}

export default FileList
