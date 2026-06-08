export interface GraphqlError {
  message: string;
  [key: string]: unknown;
}

export interface GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlError[];
}

export async function graphqlFetch<T, V extends Record<string, unknown> = Record<string, unknown>>(
  endpoint: string,
  query: string,
  variables: V,
  accessToken: string,
  clientName = 'entur-ninkasi'
): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Et-Client-Name': clientName,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json: GraphqlResponse<T> = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join('; '));
  }
  if (!json.data) {
    throw new Error('GraphQL response missing data');
  }
  return json.data;
}
