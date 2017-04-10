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

export default rolesParser