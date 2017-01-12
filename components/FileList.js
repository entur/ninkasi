import React from 'react'

const FileList = props => {
  return (
    <select style={{flex: 3}} id={props.wrapperId} multiple className="multiselect">
      { props.files.map((file,index) => <option key={ props.wrapperId + index }>{ file }</option> ) }
    </select>
  )
}

export default FileList
