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

export const getPaginationMap = (chouetteJobStatus, sortProperty, sortOrder, filterFromDate) => {
  const filteredStatus =
    chouetteJobStatus
      .filter(job => {
        if (!filterFromDate) return true;

        return new Date(job.created) > new Date(filterFromDate);
      })
      .sort((curr, prev) => {
        if (sortOrder === 0) {
          return curr[sortProperty] > prev[sortProperty] ? -1 : 1;
        }

        if (sortOrder === 1) {
          return curr[sortProperty] > prev[sortProperty] ? 1 : -1;
        }

        return 0;
      }) || [];

  const paginationMap = [];

  for (let i = 0, j = filteredStatus.length; i < j; i += 20) {
    paginationMap.push(filteredStatus.slice(i, i + 20));
  }

  return paginationMap;
};
