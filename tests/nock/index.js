import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import SuppliersActions from './../../actions/SuppliersActions'
import * as types from './../../actions/actionTypes'
import nock from 'nock'
import cfgreader from './../../config/readConfig'
import expect from 'expect'

const suppliers = require('./mocks/suppliers.json')
const supplierStatusHTTP = require('./mocks/supplierStatusHTTP.json')
const supplierStatusClient = require('./mocks/supplierStatusClient.json')
const allChouetteJobsClient = require('./mocks/allChouetteJobsClient.json')
const allChouetteJobsHTTP = require('./mocks/allChouetteJobsHTTP.json')
const providerChouetteJobsHTTP = require('./mocks/providerChouetteJobsHTTP')
const providerChouetteJobsClient = require('./mocks/providerChouetteJobsClient')

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

cfgreader.readConfig( (function(config) {
  window.config = config
}))

const nabuBaseUrl = "https://carbon.rutebanken.org/api/nabu/1.0/"
const mardukBaseUrl = "https://carbon.rutebanken.org/api/marduk/1.0/"

// Using JDom to inject window object and later the config object used by cfgreader.readConfig
window.config = {
  nabuBaseUrl: nabuBaseUrl,
  mardukBaseUrl: mardukBaseUrl
}

describe('async actions: testing correct states', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('Should create REQUESTED_SUPPLIERS and RECEIVED_SUPPLIERS when fetching suppliers', () => {

    nock(nabuBaseUrl + 'jersey/')
      .log(console.log)
      .get('/providers/all')
      .reply(200, suppliers)

    const expectedActions = [
      { type: types.REQUESTED_SUPPLIERS, payLoad: null },
      { type: types.RECEIVED_SUPPLIERS, payLoad: suppliers }
    ]
    const store = mockStore({ suppliers: [] })

    return store.dispatch(SuppliersActions.fetchSuppliers())
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('Should create REQUESTED_SUPPLIER_STATUS and RECEIVED_SUPPLIER_STATUS when fetching provider status', () => {

    const providerId = 1

    nock(nabuBaseUrl + 'jersey/')
      .log(console.log)
      .get(`/jobs/${providerId}`)
      .reply(200, supplierStatusHTTP)

    const expectedActions = [
      { type: types.REQUESTED_SUPPLIER_STATUS, payLoad: null },
      { type: types.RECEIVED_SUPPLIER_STATUS, payLoad: supplierStatusClient }
    ]

    const store = mockStore({ suppliers: [] })

    return store.dispatch(SuppliersActions.getProviderStatus(providerId))
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('Should create REQUESTED_ALL_CHOUETTE_JOB_STATUS and SUCCESS_ALL_CHOUETTE_JOB_STATUS when fetching chouette jobs for all providers', () => {

    nock(`${mardukBaseUrl}admin/services`)
      .log(console.log)
      .get(`/chouette/jobs?`)
      .reply(200, allChouetteJobsHTTP)

    const store = mockStore({ MardukReducer: {
      chouetteJobAllFilter: {}
    }, chouetteAllJobStatus: [] })

    const expectedActions = [
     { type: types.REQUESTED_ALL_CHOUETTE_JOB_STATUS, payLoad: null },
     { type: types.SUCCESS_ALL_CHOUETTE_JOB_STATUS, payLoad: allChouetteJobsClient }
    ]

    return store.dispatch(SuppliersActions.getChouetteJobsForAllSuppliers())
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('Should create REQUESTED_ALL_CHOUETTE_JOB_STATUS and SUCCESS_ALL_CHOUETTE_JOB_STATUS when fetching chouette jobs for a given provider', () => {

    nock(`${mardukBaseUrl}admin/services`)
      .log(console.log)
      .get(`/chouette/1/jobs?`)
      .reply(200, providerChouetteJobsHTTP)

    const store = mockStore(
      { MardukReducer: {
        chouetteJobFilter: {}
      }, SuppliersReducer: {
        activeId: 1
      },
      chouetteAllJobStatus: []
    })

    const expectedActions = [
     { type: types.REQUESTED_CHOUETTE_JOBS_FOR_PROVIDER, payLoad: null },
     { type: types.SUCCESS_CHOUETTE_JOB_STATUS, payLoad: providerChouetteJobsClient }
    ]

    return store.dispatch(SuppliersActions.getChouetteJobStatus())
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('Should build OTP graph and display notification message', () => {

    nock(`${mardukBaseUrl}admin/services/`)
      .log(console.log)
      .post(`/graph/build`)
      .reply(200, {})

    const store = mockStore()

    const expectedActions = [
      { type: types.REQUEST_BUILD_GRAPH },
      { type: types.SUCCESS_BUILD_GRAPH, payLoad: {}},
      { type: types.ADD_NOTIFICATION, level: "success", message: "Graph build started" },
      { type: types.LOG_EVENT, payLoad: {title: 'Graph build started'} }
    ]

    return store.dispatch(SuppliersActions.buildGraph())
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })

  })


})
