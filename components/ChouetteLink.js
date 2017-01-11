import React from 'react'

const ChouetteLink = ({ action, id, referential, children }) => {

  const baseURL = 'https://redigering.rutebanken.org/referentials/'
  const actionMap = {
    "importer": `imports/${id}/compliance_check`,
    "exporter": `exports/${id}/compliance_check`,
    "validator": `compliance_checks/${id}/report`
  }
  const URL = `${baseURL}${referential}/${actionMap[action]}`

  return (
    <a title={URL} target="_blank" href={URL}>{children}</a>
  )

}

export default ChouetteLink

