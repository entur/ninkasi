import React from 'react'
import classNames from 'classnames'

const OutboundFilelist = (props) => {

    if (props.files && props.files.length) {
      return (
        <select id='outboundFilelist' multiple className="multiselect">
          {props.files.map((file,index) => {
            return (
                <option key={index}>{file}</option>
            )
          })}
        </select>
      )
    } else {
        return (
            <div className="no-files">No files are added to export.</div>
        )
    }
}

export default OutboundFilelist
