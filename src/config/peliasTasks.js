/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

const peliasTasks = [
  {
    label: "Sync Google Cloud with Kartverket's administrative units",
    task: 'ADMINISTRATIVE_UNITS_DOWNLOAD'
  },
  {
    label: 'Sync Tiamat with administrative units from Google Cloud',
    task: 'TIAMAT_ADMINISTRATIVE_UNITS_UPDATE'
  },
  {
    label: 'Sync Tiamat with OSM POI from Google cloud',
    task: 'TIAMAT_POI_UPDATE'
  },
  {
    label: "Sync Google Cloud with Kartverket's addresses",
    task: 'ADDRESS_DOWNLOAD'
  },
  {
    label: "Sync Google Cloud with Kartverket's place names",
    task: 'PLACE_NAMES_DOWNLOAD'
  },
  {
    label: 'Export stop places, POI and administrative units from Tiamat',
    task: 'TIAMAT_EXPORT'
  },
  { label: 'Build and deploy Pelias', task: 'PELIAS_UPDATE' }
];

export default peliasTasks;
