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
  let isAdmin = false

  tokenParsed.roles.forEach( roleString => {
    let roleJSON = JSON.parse(roleString)
    if (roleJSON.r === 'editRouteData') {
      allowedOrganisations.push(roleJSON.o)
    } else if (roleJSON.r === 'adminEditRouteData') {
      isAdmin = true
    }
  })

  let userOrganisations = []

  if (isAdmin) return providers

  providers.forEach( org => {
    if (org.sftpAccount && allowedOrganisations.indexOf(org.sftpAccount.toUpperCase()) > -1)
      userOrganisations.push(org)
  })

  return userOrganisations
}

rolesParser.isAdmin = tokenParsed => {
  if (!tokenParsed || !tokenParsed.roles) return false

  for (let i = 0; i < tokenParsed.roles.length; i++) {
    let role = JSON.parse(tokenParsed.roles[i])
    if (role.r === 'adminEditRouteData') return true
  }

  return false
}

export default rolesParser