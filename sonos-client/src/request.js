export async function request(scope, query, variables) {
  let response = await scope.fetch("/api", {
    headers: {
      Cookie: scope.store.get().Cookie,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method: "POST",
    body: JSON.stringify({ query: query.trim(), variables })
  });

  if (response.ok === false) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  // TODO: This doesn't handle errors
  let payload = await response.json();

  return payload;
}

export async function mutate(query, variables) {
  let response = await fetch("/api", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method: "POST",
    body: JSON.stringify({ query: query.trim(), variables })
  });

  if (response.ok === false) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  // TODO: This doesn't handle errors
  let payload = await response.json();

  return payload;
}

export function mutator(query) {
  return variables => mutate(query, variables);
}
