import {
  createGroup,
  getGroups,
  updateStatus,
  joinGroup,
  deleteGroup,
} from "/api/groupApi.mjs";
import { currentUser, setStatus, setCurrentUser } from "/state/appState.mjs";

import {
  openCreateGroupModal,
  closeCreateGroupModal,
  setError,
} from "/ui/modals.mjs";

import {
  addGroupTab,
  goToGroupView,
  goBackToDashboard,
  showLoggedOutUI,
  showLoggedInUI,
} from "/ui/views.mjs";
import { renderMember } from "/ui/members.mjs";

import {
  createGroupBtn,
  submitCreateGroupBtn,
  groupNameInput,
  freeNowBtn,
  loginBtn,
  registerBtn,
  loginModal,
  registerModal,
  createGroupModal,
  closeLoginModalBtn,
  closeRegisterModalBtn,
  submitRegisterBtn,
  submitLoginBtn,
  tosConsent,
  viewTosLink,
  viewPrivacyLink,
  tosModal,
  privacyModal,
  closeTosModalBtn,
  closePrivacyModalBtn,
  cancelCreateGroupBtn,
  closeCreateGroupModalBtn,
  backToDashboardBtn,
  logoutBtn,
  editAccountBtn,
  accountView,
  accountUsername,
  backFromAccountBtn,
  homeView,
  groupView,
  changeUsernameBtn,
  changeUsernameModal,
  closeChangeUsernameModalBtn,
  cancelChangeUsernameBtn,
  submitChangeUsernameBtn,
  changeUsernameInput,
  changeUsernameError,
  deleteAccountBtn,
} from "/utils/dom.mjs";

let currentGroup = null;

const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
  const user = JSON.parse(savedUser);
  setCurrentUser(user);

  homeView.style.display = "none";
  groupView.style.display = "flex";
  showLoggedInUI();
  renderMember(user.displayName, user.status);

  try {
    const groups = await getGroups(user.id);
    groups.forEach((group) => addGroupTab(group));
  } catch (err) {
    console.error("Error loading groups:", err);
  }
}

createGroupBtn.addEventListener("click", openCreateGroupModal);

submitCreateGroupBtn.addEventListener("click", async () => {
  const name = groupNameInput.value.trim();

  if (name.length < 2) {
    setError("Group name must be at least 2 characters.");
    return;
  }

  try {
    const group = await createGroup(name, currentUser.id);
    addGroupTab(group);
    closeCreateGroupModal();
    currentGroup = group;
    goToGroupView(group);
  } catch (err) {
    setError(err.message);
  }
});

export function setCurrentGroup(group) {
  currentGroup = group;
}

document.getElementById("joinBtn").addEventListener("click", () => {
  document.getElementById("joinGroupModal").showModal();
});

document.getElementById("closeJoinModalBtn").addEventListener("click", () => {
  document.getElementById("joinGroupModal").close();
});

document.getElementById("cancelJoinBtn").addEventListener("click", () => {
  document.getElementById("joinGroupModal").close();
});

document.getElementById("submitJoinBtn").addEventListener("click", async () => {
  const code = document.getElementById("joinCodeInput").value.trim();
  const error = document.getElementById("joinGroupError");
  error.textContent = "";

  if (!code) {
    error.textContent = "Please enter a code.";
    return;
  }

  try {
    const group = await joinGroup(code, currentUser.id);
    addGroupTab(group);
    document.getElementById("joinGroupModal").close();
    document.getElementById("joinCodeInput").value = "";
    currentGroup = group;
    goToGroupView(group);
  } catch (err) {
    error.textContent = err.message;
  }
});

document.getElementById("codeBtn").addEventListener("click", () => {
  document.getElementById("groupCodeDisplay").textContent =
    currentGroup.join_code;
  document.getElementById("groupCodeModal").showModal();
});

document
  .getElementById("closeGroupCodeModalBtn")
  .addEventListener("click", () => {
    document.getElementById("groupCodeModal").close();
  });

document.getElementById("copyCodeBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(currentGroup.join_code);
  document.getElementById("copyCodeBtn").textContent = "Copied!";
  setTimeout(() => {
    document.getElementById("copyCodeBtn").textContent = "Copy Code";
  }, 2000);
});

document
  .getElementById("deleteGroupBtn")
  .addEventListener("click", async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${currentGroup.name}"?`
    );
    if (!confirmed) return;

    try {
      await deleteGroup(currentGroup.id);
      currentGroup = null;

      // Remove the group tab from the dashboard
      document.querySelectorAll(".group-tab").forEach((tab) => {
        if (tab.dataset.groupId == currentGroup?.id) tab.remove();
      });

      goBackToDashboard();

      // Reload group tabs
      document.getElementById("groupsList").innerHTML =
        '<p class="muted">List of the groups you are apart of</p>';
      const groups = await getGroups(currentUser.id);
      groups.forEach((group) => addGroupTab(group));
    } catch (err) {
      alert(err.message);
    }
  });

freeNowBtn.addEventListener("click", async () => {
  const newStatus = currentUser.status === "FREE" ? "BUSY" : "FREE";
  const data = await updateStatus(newStatus);
  setStatus(data.status);
  renderMember(currentUser.displayName, data.status);
});

loginBtn.addEventListener("click", () => loginModal.showModal());
registerBtn.addEventListener("click", () => registerModal.showModal());
getStartedBtn.addEventListener("click", () => registerModal.showModal());

closeLoginModalBtn.addEventListener("click", () => loginModal.close());
closeRegisterModalBtn.addEventListener("click", () => registerModal.close());
cancelCreateGroupBtn.addEventListener("click", () => createGroupModal.close());
closeCreateGroupModalBtn.addEventListener("click", () =>
  createGroupModal.close()
);

submitRegisterBtn.addEventListener("click", async () => {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!tosConsent.checked) {
    alert("You must agree to the Terms of Service.");
    return;
  }

  const res = await fetch("/api/v1/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, tosAgreed: true }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Registration failed");
    return;
  }

  registerModal.close();
});

submitLoginBtn.addEventListener("click", async () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const res = await fetch("/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  const user = {
    id: data.userId,
    username: data.username,
    displayName: data.username,
  };
  setCurrentUser(user);
  localStorage.setItem("currentUser", JSON.stringify(user));

  try {
    const groups = await getGroups(user.id);
    groups.forEach((group) => addGroupTab(group));
  } catch (err) {
    console.error("Error loading groups:", err);
  }

  loginModal.close();

  homeView.style.display = "none";
  groupView.style.display = "flex";

  showLoggedInUI();
  renderMember(currentUser.displayName, currentUser.status);
});

logoutBtn.addEventListener("click", () => {
  setCurrentUser(null);
  currentGroup = null;
  localStorage.removeItem("currentUser");
  showLoggedOutUI();
});

[loginModal, registerModal].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
});

viewTosLink.addEventListener("click", (e) => {
  e.preventDefault();
  tosModal.showModal();
});

viewPrivacyLink.addEventListener("click", (e) => {
  e.preventDefault();
  privacyModal.showModal();
});

closeTosModalBtn.addEventListener("click", () => tosModal.close());
closePrivacyModalBtn.addEventListener("click", () => privacyModal.close());

[tosModal, privacyModal].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
});

backToDashboardBtn.addEventListener("click", () => {
  currentGroup = null;
  goBackToDashboard();
});

editAccountBtn.addEventListener("click", () => {
  homeView.style.display = "none";
  groupView.style.display = "none";
  accountView.style.display = "flex";
  accountUsername.textContent = currentUser.displayName;
});

backFromAccountBtn.addEventListener("click", () => {
  accountView.style.display = "none";
  groupView.style.display = "flex";
});

changeUsernameBtn.addEventListener("click", () =>
  changeUsernameModal.showModal()
);
closeChangeUsernameModalBtn.addEventListener("click", () =>
  changeUsernameModal.close()
);
cancelChangeUsernameBtn.addEventListener("click", () =>
  changeUsernameModal.close()
);

submitChangeUsernameBtn.addEventListener("click", async () => {
  const newUsername = changeUsernameInput.value.trim();
  changeUsernameError.textContent = "";

  try {
    const res = await fetch("/api/v1/username", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, newUsername }),
    });

    const data = await res.json();

    if (!res.ok) {
      changeUsernameError.textContent = data.error || "Update failed";
      return;
    }

    const updatedUser = {
      ...currentUser,
      username: data.username,
      displayName: data.username,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    accountUsername.textContent = data.username;
    changeUsernameModal.close();
    changeUsernameInput.value = "";
    alert("Username updated!");
  } catch (err) {
    changeUsernameError.textContent = "An error occurred. Please try again.";
  }
});

deleteAccountBtn.addEventListener("click", async () => {
  const confirmed = confirm(
    "Are you sure? This will permanently delete your account."
  );
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/v1/${currentUser.id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete account");
      return;
    }

    alert("Your account has been deleted.");
    setCurrentUser(null);
    currentGroup = null;
    localStorage.removeItem("currentUser");
    showLoggedOutUI();
  } catch (err) {
    alert("An error occurred while trying to delete your account.");
  }
});
