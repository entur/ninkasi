import React from 'react'
import classNames from 'classnames'

const ProviderFilelist = (props) => {
  return (
      <select multiple id="providerFilelist" className="multiselect">
        {props.files.map((file, index) => {
          return (
              <option key={index}>{file.name}</option>
          )
        })}
      </select>
    )
}

export default ProviderFilelist
