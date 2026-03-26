import { api } from "./api.mjs";

export async function createGroup(name, userId) {
  return api("/api/v1/groups", {
    method: "POST",
    body: { name, userId },
  });
}

export async function getGroups(userId) {
  return api(`/api/v1/groups?userId=${userId}`);
}

export async function getMembers(groupId) {
  return api(`/api/v1/groups/${groupId}/members`);
}

export async function updateStatus(groupId, userId, status) {
  return api(`/api/v1/groups/${groupId}/status`, {
    method: "PUT",
    body: { userId, status },
  });
}

export async function joinGroup(joinCode, userId) {
  return api("/api/v1/groups/join", {
    method: "POST",
    body: { joinCode, userId },
  });
}

export async function deleteGroup(groupId) {
  return api(`/api/v1/groups/${groupId}`, {
    method: "DELETE",
  });
}

export async function subscribeUser(userId, subscription) {
  return api("/api/v1/subscribe", {
    method: "POST",
    body: { userId, subscription },
  });
}
