export const currentUser = {
  id: null,
  displayName: null,
  status: "BUSY",
};

export function setCurrentUser(user) {
  currentUser.id = user.id;
  currentUser.displayName = user.username;
}

export function setStatus(status) {
  currentUser.status = status;
}
