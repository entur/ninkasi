const peliasTasks = [
  { label: "Sync Google Cloud with Kartverket's administrative units", task: "ADMINISTRATIVE_UNITS_DOWNLOAD" },
  { label: "Sync Tiamat with administrative units from Google Cloud", task: "TIAMAT_ADMINISTRATIVE_UNITS_UPDATE" },
  { label: "Sync Tiamat with OSM POI from Google cloud", task: "TIAMAT_POI_UPDATE" },
  { label: "Sync Google Cloud with Kartverket's addresses", task: "ADDRESS_DOWNLOAD" },
  { label: "Sync Google Cloud with Kartverket's place names", task: "PLACE_NAMES_DOWNLOAD" },
  { label: "Export stop places, POI and administrative units from Tiamat", task: "TIAMAT_EXPORT" },
  { label: "Build and deploy Pelias", task: "PELIAS_UPDATE" }
  ];

  export default peliasTasks;