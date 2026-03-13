export const currentUser = {
  id: null,
  displayName: null,
  status: "BUSY",
};

export function setCurrentUser(user) {
  if (!user) {
    currentUser.id = null;
    currentUser.displayName = null;
    currentUser.status = "BUSY";
    return;
  }
  currentUser.id = user.id;
  currentUser.displayName = user.username;
}

export function setStatus(status) {
  currentUser.status = status;
}
