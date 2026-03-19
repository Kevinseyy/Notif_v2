import { createGroup, getGroups, updateStatus } from "/api/groupApi.mjs";
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

createGroupBtn.addEventListener("click", openCreateGroupModal);

submitCreateGroupBtn.addEventListener("click", async () => {
  const name = groupNameInput.value.trim();

  if (name.length < 2) {
    setError("Group name must be at least 2 characters.");
    return;
  }

  try {
    const group = await createGroup(name);
    addGroupTab(group);
    closeCreateGroupModal();
    goToGroupView(group);
  } catch (err) {
    setError(err.message);
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

  console.log("Sending register request...");

  const res = await fetch("/api/v1/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      tosAgreed: true,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Registration failed");
    return;
  }

  console.log("User created:", data.userId);

  registerModal.close();
});

submitLoginBtn.addEventListener("click", async () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const res = await fetch("/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  console.log("Login successful:", data.username);

  setCurrentUser({
    id: data.userId,
    username: data.username,
  });

  try {
    const groups = await getGroups();
    groups.forEach((group) => addGroupTab(group));
  } catch (err) {
    console.error("Error loading groups:", err);
  }

  loginModal.close();

  document.getElementById("homeView").style.display = "none";
  document.getElementById("groupView").style.display = "flex";

  showLoggedInUI();

  renderMember(currentUser.displayName, currentUser.status);
});

logoutBtn.addEventListener("click", () => {
  setCurrentUser(null);
  showLoggedOutUI();
  console.log("User logged out");
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

changeUsernameBtn.addEventListener("click", () => {
  changeUsernameModal.showModal();
});

closeChangeUsernameModalBtn.addEventListener("click", () => {
  changeUsernameModal.close();
});

cancelChangeUsernameBtn.addEventListener("click", () => {
  changeUsernameModal.close();
});

submitChangeUsernameBtn.addEventListener("click", async () => {
  const newUsername = changeUsernameInput.value.trim(); //

  changeUsernameError.textContent = "";

  try {
    const res = await fetch("/api/v1/username", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        newUsername: newUsername,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      changeUsernameError.textContent = data.error || "Update failed";
      return;
    }

    setCurrentUser({
      ...currentUser,
      username: data.username,
      displayName: data.username,
    });

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
    const res = await fetch(`/api/v1/${currentUser.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete account");
      return;
    }

    alert("Your account has been deleted.");

    setCurrentUser(null);
    showLoggedOutUI();
  } catch (err) {
    console.error("Delete error:", err);
    alert("An error occurred while trying to delete your account.");
  }
});
