import {
  createGroup,
  getGroups,
  updateStatus,
  joinGroup,
  deleteGroup,
  subscribeUser,
} from "/api/groupApi.mjs";
import { currentUser, setCurrentUser } from "/state/appState.mjs";

import {
  openCreateGroupModal,
  closeCreateGroupModal,
  setError,
  initModals,
} from "/ui/modals.mjs";

import {
  addGroupTab,
  goToGroupView,
  goBackToDashboard,
  showLoggedOutUI,
  showLoggedInUI,
} from "/ui/views.mjs";
import { renderMember } from "/ui/members.mjs";

import { t, setLang, applyTranslations } from "/utils/i18n.mjs";

import {
  createGroupBtn,
  submitCreateGroupBtn,
  groupNameInput,
  freeNowBtn,
  loginBtn,
  registerBtn,
  loginModal,
  registerModal,
  submitRegisterBtn,
  submitLoginBtn,
  tosConsent,
  backToDashboardBtn,
  logoutBtn,
  editAccountBtn,
  accountView,
  accountUsername,
  backFromAccountBtn,
  homeView,
  groupView,
  activeGroupView,
  changeUsernameBtn,
  changeUsernameModal,
  submitChangeUsernameBtn,
  changeUsernameInput,
  changeUsernameError,
  deleteAccountBtn,
  gearBtn,
  langDrawer,
  drawerBackdrop,
  closeDrawerBtn,
  joinBtn,
  joinGroupModal,
  submitJoinBtn,
  joinCodeInput,
  joinGroupError,
  codeBtn,
  groupCodeModal,
  groupCodeDisplay,
  copyCodeBtn,
  deleteGroupBtn,
  groupsList,
  registerUsername,
  registerPassword,
  loginUsername,
  loginPassword,
  offlineScreen,
  loaderScreen,
} from "/utils/dom.mjs";

async function registerPushSubscription(userId) {
  if (!("PushManager" in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BI7H6PbtZQXmjPjDMjxtMQj_0Q3L09N3rF4grmedWP3UCNC6L2CFY4HUPQ0MoilRLi3eJcX1ZWO_g-1kKpqpFn4",
  });

  await subscribeUser(userId, subscription);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

function updateOnlineStatus() {
  if (!navigator.onLine) {
    offlineScreen.style.display = "flex";
  } else {
    offlineScreen.style.display = "none";
  }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();

let currentGroup = null;
let previousView = null;

applyTranslations();
initModals();

const savedFreeUntil = localStorage.getItem("freeUntil");
if (savedFreeUntil) {
  setFreeButton(Number(savedFreeUntil));
}

const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
  showLoader();
  const user = JSON.parse(savedUser);
  setCurrentUser(user);
  await registerPushSubscription(user.id);

  homeView.style.display = "none";
  groupView.style.display = "flex";
  showLoggedInUI();
  renderMember(user.displayName);

  try {
    const groups = await getGroups(user.id);
    groups.forEach((group) => addGroupTab(group));
  } catch (err) {
    console.error("Error loading groups:", err);
  }
  hideLoader();
}

createGroupBtn.addEventListener("click", openCreateGroupModal);

submitCreateGroupBtn.addEventListener("click", async () => {
  showLoader();
  const name = groupNameInput.value.trim();

  if (name.length < 2) {
    setError(t("groupNameShort"));
    return;
  }

  try {
    const group = await createGroup(name, currentUser.id);
    addGroupTab(group);
    closeCreateGroupModal();
    currentGroup = group;
    await goToGroupView(group);
  } catch (err) {
    setError(err.message);
  }
  hideLoader();
});

export function setCurrentGroup(group) {
  currentGroup = group;
}

joinBtn.addEventListener("click", () => joinGroupModal.showModal());

submitJoinBtn.addEventListener("click", async () => {
  showLoader();
  const code = joinCodeInput.value.trim();
  joinGroupError.textContent = "";

  if (!code) {
    joinGroupError.textContent = t("enterCode");
    return;
  }

  try {
    const group = await joinGroup(code, currentUser.id);
    addGroupTab(group);
    joinGroupModal.close();
    joinCodeInput.value = "";
    currentGroup = group;
    await goToGroupView(group);
  } catch (err) {
    joinGroupError.textContent =
      err.message === "Invalid code" ? t("invalidCode") : t("loginFailed");
  }
  hideLoader();
});

codeBtn.addEventListener("click", () => {
  groupCodeDisplay.textContent = currentGroup.join_code;
  groupCodeModal.showModal();
});

copyCodeBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(currentGroup.join_code);
  copyCodeBtn.textContent = t("copied");
  setTimeout(() => {
    copyCodeBtn.textContent = t("copyCode");
  }, 2000);
});

deleteGroupBtn.addEventListener("click", async () => {
  const confirmed = confirm(t("deleteGroupConfirm"));
  if (!confirmed) return;

  try {
    await deleteGroup(currentGroup.id);
    currentGroup = null;
    goBackToDashboard();
    groupsList.innerHTML = `<p class="muted">${t("groupsListPlaceholder")}</p>`;
    const groups = await getGroups(currentUser.id);
    groups.forEach((group) => addGroupTab(group));
  } catch (err) {
    alert(t("deleteGroupFailed"));
  }
});

function setFreeButton(freeUntil) {
  const remaining = freeUntil - Date.now();
  if (remaining <= 0) return;

  freeNowBtn.disabled = true;
  freeNowBtn.style.background = "#3ddc84";
  freeNowBtn.style.color = "#0b1220";
  freeNowBtn.textContent = "You're free!";

  setTimeout(() => {
    freeNowBtn.disabled = false;
    freeNowBtn.style.background = "";
    freeNowBtn.style.color = "";
    freeNowBtn.textContent = t("freeNow");
    localStorage.removeItem("freeUntil");
  }, remaining);
}

freeNowBtn.addEventListener("click", async () => {
  if (freeNowBtn.disabled) return;

  const data = await updateStatus(currentGroup.id, currentUser.id, "FREE");

  const freeUntil = Date.now() + 10 * 60 * 1000;
  localStorage.setItem("freeUntil", freeUntil);

  setFreeButton(freeUntil);
});

loginBtn.addEventListener("click", () => loginModal.showModal());
registerBtn.addEventListener("click", () => registerModal.showModal());
getStartedBtn.addEventListener("click", () => registerModal.showModal());

submitRegisterBtn.addEventListener("click", async () => {
  const username = registerUsername.value.trim();
  const password = registerPassword.value.trim();

  if (!tosConsent.checked) {
    alert(t("tosRequired"));
    return;
  }

  const res = await fetch("/api/v1/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, tosAgreed: true }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(
      data.error === "Username already taken"
        ? t("usernameTaken")
        : t("registrationFailed")
    );
    return;
  }

  registerModal.close();
});

submitLoginBtn.addEventListener("click", async () => {
  showLoader();
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  const res = await fetch("/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(
      data.error === "User not found"
        ? t("userNotFound")
        : data.error === "Incorrect password"
        ? t("incorrectPassword")
        : t("loginFailed")
    );
    return;
  }

  const user = {
    id: data.userId,
    username: data.username,
    displayName: data.username,
  };
  setCurrentUser(user);
  localStorage.setItem("currentUser", JSON.stringify(user));

  await registerPushSubscription(user.id);

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
  renderMember(currentUser.displayName);
  hideLoader();
});

logoutBtn.addEventListener("click", () => {
  setCurrentUser(null);
  currentGroup = null;
  localStorage.removeItem("currentUser");
  groupsList.innerHTML = `<p class="muted">${t("groupsListPlaceholder")}</p>`;
  showLoggedOutUI();
});

backToDashboardBtn.addEventListener("click", () => {
  currentGroup = null;
  goBackToDashboard();
});

editAccountBtn.addEventListener("click", () => {
  if (activeGroupView.style.display !== "none") {
    previousView = "activeGroup";
  } else {
    previousView = "group";
  }

  homeView.style.display = "none";
  activeGroupView.style.display = "none";
  groupView.style.display = "none";
  accountView.style.display = "flex";
  accountUsername.textContent = currentUser.displayName;
});

backFromAccountBtn.addEventListener("click", () => {
  accountView.style.display = "none";
  if (previousView === "activeGroup") {
    activeGroupView.style.display = "block";
  } else {
    groupView.style.display = "flex";
  }
  previousView = null;
});

changeUsernameBtn.addEventListener("click", () =>
  changeUsernameModal.showModal()
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
      changeUsernameError.textContent =
        data.error === "Username already taken"
          ? t("usernameTaken")
          : t("updateFailed");
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
    alert(t("usernameUpdated"));
  } catch (err) {
    changeUsernameError.textContent = t("errorOccurred");
  }
});

deleteAccountBtn.addEventListener("click", async () => {
  const confirmed = confirm(t("deleteConfirm"));
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/v1/${currentUser.id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || t("deleteAccountFailed"));
      return;
    }

    alert(t("accountDeleted"));
    setCurrentUser(null);
    currentGroup = null;
    localStorage.removeItem("currentUser");
    showLoggedOutUI();
  } catch (err) {
    alert(t("errorOccurred"));
  }
});

gearBtn.addEventListener("click", () => {
  langDrawer.classList.add("open");
  drawerBackdrop.style.display = "block";
});

closeDrawerBtn.addEventListener("click", () => {
  langDrawer.classList.remove("open");
  drawerBackdrop.style.display = "none";
});

drawerBackdrop.addEventListener("click", () => {
  langDrawer.classList.remove("open");
  drawerBackdrop.style.display = "none";
});

document.querySelectorAll(".drawer-item[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setLang(btn.dataset.lang);
    applyTranslations();
    langDrawer.classList.remove("open");
    drawerBackdrop.style.display = "none";
  });
});

function showLoader() {
  loaderScreen.style.display = "flex";
}

function hideLoader() {
  loaderScreen.style.display = "none";
}
