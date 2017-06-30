export const sortUsersby = (users, sortOrder) => {
  if (!sortOrder || sortOrder.column === null) return users;

  const { column, asc } = sortOrder;

  const keySorter = {
    username: (a, b, asc) =>
      asc ? sortAsc(a.username, b.username) : sortDesc(a.username, b.username),
    firstName: (a, b, asc) =>
      asc
        ? sortAsc(a.contactDetails.firstName, b.contactDetails.firstName)
        : sortDesc(a.contactDetails.firstName, b.contactDetails.firstName),
    lastName: (a, b, asc) =>
      asc
        ? sortAsc(a.contactDetails.lastName, b.contactDetails.lastName)
        : sortDesc(a.contactDetails.lastName, b.contactDetails.lastName),
    email: (a, b, asc) =>
      asc
        ? sortAsc(a.contactDetails.email, b.contactDetails.email)
        : sortDesc(a.contactDetails.email, b.contactDetails.email),
    organisation: (a, b, asc) =>
      asc
        ? sortAsc(a.organisation.name, b.organisation.name)
        : sortDesc(a.organisation.name, b.organisation.name)
  };

  return users.slice(0).sort((a, b) => keySorter[column](a, b, asc));
};

export const sortByColumns = (items, sortOrder) => {
  if (!sortOrder || sortOrder.column === null) return items;
  const { column, asc } = sortOrder;
  return items
    .slice(0)
    .sort(
      (a, b) =>
        asc ? sortAsc(a[column], b[column]) : sortDesc(a[column], b[column])
    );
};

const sortAsc = (a, b) => {
  return a.localeCompare(b);
};

const sortDesc = (a, b) => {
  return b.localeCompare(a);
};

export const getEntityClassificationRefString = (entityType, allow) => {
  if (!allow) {
    const lastIndex = entityType.lastIndexOf(':');
    if (lastIndex > -1) {
      return entityType.substr(0, lastIndex+1) + '!' + entityType.substr(lastIndex+1);
    }
  }
  return entityType;
}

export const getOrganizationNameByRef = (organizations, ref) => {
  if (!organizations) return ref;

  for (let i = 0; i < organizations.length; i++) {
    let org = organizations[i];
    if (org.id === ref) return org.name;
  }
  return ref;
}

export const getAdminZoneNameByRef = (adminZones, ref) => {
  if (!adminZones) return ref;

  for (let i = 0; i < adminZones.length; i++) {
    let zone = adminZones[i];
    if (zone.id === ref) return zone.name;
  }
  return ref;
}