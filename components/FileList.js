import React from 'react'

const FileList = props => {

  let list = null

  if (props.files && props.files.length) {

    list = (
      <select style={{flex: 3}} id={props.wrapperId} multiple className="multiselect">
        { props.files.map((file,index) => <option key={ props.wrapperId + index }>{ file }</option> ) }
      </select>
    )
  }

  return list
}

export default FileList
