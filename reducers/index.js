import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

import SuppliersReducer from './SuppliersReducer'
import MardukReducer from './MardukReducer'


export default {
  SuppliersReducer: SuppliersReducer,
  MardukReducer: MardukReducer
}
