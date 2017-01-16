
export const filterLines = (lineData, selectedSegment, daysValid) => {
  if (lineData.hasOwnProperty(selectedSegment)) {
    return lineData[selectedSegment].lineNumbers
  }

  for (let i in lineData.validity) {
    let category = lineData.validity[i]
    if (category.numDaysAtLeastValid == daysValid) {
      return category.lineNumbers
    }
  }

  // fallback to all
  console.log("error, showing all data")
  return lineData['all'].lineNumbers
}


export const validity = (daysForward) => {
  if (daysForward > 127) {
    return 'VALID'
  } else if (daysForward >= 120) {
    return 'SOON_INVALID'
  } else {
    return 'INVALID'
  }
}

export const segmentName = (segment, numDays) => {
  if (segmentMap.hasOwnProperty(segment) && segment !== 'dynamic') {
    return segmentMap[segment]
  }

  return segmentMap['dynamic'].replace('DAYS', numDays)
}

export const segmentName2Key = (segmentName) => {
  if (!text2key.hasOwnProperty(segmentName)) {
    let idxStart = segmentName.indexOf('- ') + 2
    let idxEnd = segmentName.indexOf(' days')

    return {segment: 'dynamic', daysValid: parseInt(segmentName.substring(idxStart, idxEnd))}
  }
  return {segment: text2key[segmentName], daysValid: 0}
}

const segmentMap = {
  'valid' : 'Valid lines',
  'soonInvalid' : 'Valid lines that are soon expiring',
  'invalid' : 'Invalid lines',
  'all' : 'All lines',
  'dynamic': 'Expired lines - DAYS days left'
}

const text2key = {
  'All lines' : 'all',
  'Valid lines' : 'valid',
  'Valid lines that are soon expiring' : 'soonInvalid',
  'Invalid lines' : 'invalid',
}
