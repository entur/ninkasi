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

const sortDesc = (a, b) => {
  return a.localeCompare(b);
};

const sortAsc = (a, b) => {
  return b.localeCompare(a);
};
