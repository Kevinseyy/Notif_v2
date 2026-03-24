export async function createGroup(name, userId) {
  const res = await fetch("/api/v1/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed");
  }

  return res.json();
}

export async function getGroups(userId) {
  const res = await fetch(`/api/v1/groups?userId=${userId}`);
  if (!res.ok) throw new Error("Could not load groups");
  return res.json();
}

export async function getMembers(groupId) {
  const res = await fetch(`/api/v1/groups/${groupId}/members`);
  if (!res.ok) throw new Error("Could not load members");
  return res.json();
}

export async function updateStatus(groupId, userId, status) {
  const res = await fetch(`/api/v1/groups/${groupId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, status }),
  });

  if (!res.ok) throw new Error("Status update failed");
  return res.json();
}

export async function joinGroup(joinCode, userId) {
  const res = await fetch("/api/v1/groups/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ joinCode, userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Invalid code");
  }

  return res.json();
}

export async function deleteGroup(groupId) {
  const res = await fetch(`/api/v1/groups/${groupId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete group");
  }

  return res.json();
}

export async function subscribeUser(userId, subscription) {
  const res = await fetch("/api/v1/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, subscription }),
  });

  if (!res.ok) throw new Error("Failed to subscribe");
  return res.json();
}
