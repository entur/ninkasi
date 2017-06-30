export const getPaginationMap = (chouetteJobStatus, sortProperty, sortOrder, filterFromDate) => {

  let filteredStatus = chouetteJobStatus.filter( job => {

      if (!filterFromDate) return true

      return (new Date(job.created) > new Date(filterFromDate))

    }).sort( (curr, prev) => {

      if (sortOrder == 0) {
        return (curr[sortProperty] > prev[sortProperty] ? -1 : 1)
      }

      if (sortOrder == 1) {
        return (curr[sortProperty] > prev[sortProperty] ? 1 : -1)
      }
    }) || []

  let paginationMap = []

  for (let i = 0, j = filteredStatus.length; i < j; i+=20) {
    paginationMap.push(filteredStatus.slice(i,i+20))
  }

  return paginationMap
};

