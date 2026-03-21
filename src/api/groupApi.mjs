export async function createGroup(name) {
  const res = await fetch("/api/v1/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed");
  }

  return res.json();
}

export async function getGroups() {
  const res = await fetch("/api/v1/groups");
  if (!res.ok) throw new Error("Could not load groups");
  return res.json();
}

export async function updateStatus(status) {
  const res = await fetch("/api/v1/status", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Status update failed");
  }

  return res.json();

  export async function joinGroup(joinCode) {
    const res = await fetch("/api/v1/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Invalid code");
    }

    return res.json();
  }
}
