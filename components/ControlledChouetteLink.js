import React from 'react'
import ChouetteLink from './ChouetteLink'

class ControlledChouetteLink extends React.Component {

  render() {

    const { events } = this.props

    const acceptableActions = ['IMPORT', 'EXPORT', 'VALIDATION_LEVEL_1', 'VALIDATION_LEVEL_2']

    const choueteActionMap = {
      'IMPORT': 'importer',
      'EXPORT': 'exporter',
      'VALIDATION_LEVEL_1': 'validator',
      'VALIDATION_LEVEL_2': 'validator',
    }

    if (events.states && events.states.length) {
      const endState = events.states[events.states.length-1]
      if (acceptableActions.indexOf(endState.action) > -1) {
        return (
          <ChouetteLink
            action={choueteActionMap[endState.action]}
            id={endState.chouetteJobId}
            referential={endState.referential}
          >
            { this.props.children }
          </ChouetteLink>
        )
      }
    }


    return <div> { this.props.children } </div>
  }
}

export default ControlledChouetteLink