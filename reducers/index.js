import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

import SuppliersReducer from './SuppliersReducer'
import MardukReducer from './MardukReducer'
import UtilsReducer from './UtilsReducer'

export default {
  SuppliersReducer: SuppliersReducer,
  MardukReducer: MardukReducer,
  UtilsReducer: UtilsReducer
}
