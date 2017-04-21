const rolesParser  = {}

rolesParser.canEditOrganisation = tokenParsed => {

  if (!tokenParsed || !tokenParsed.roles) return false

  let canEditOrganisation = false

  tokenParsed.roles.forEach( roleString => {
    let roleJSON = JSON.parse(roleString)
    if (roleJSON.r === 'editOrganisation') {
      canEditOrganisation = true
    }
  })
  return canEditOrganisation
}

rolesParser.getUserProviders = (tokenParsed, providers) => {

  if (!tokenParsed || !tokenParsed.roles) return []

  let allowedOrganisations = []

  tokenParsed.roles.forEach( roleString => {
    let roleJSON = JSON.parse(roleString)
    if (roleJSON.r === 'editRouteData') {
      allowedOrganisations.push(roleJSON.o)
    }
  })

  let userOrganisations = []

  providers.forEach( org => {
    if (org.sftpAccount && allowedOrganisations.indexOf(org.sftpAccount.toUpperCase()) > -1)
      userOrganisations.push(org)
  })

  return userOrganisations
}

export default rolesParser