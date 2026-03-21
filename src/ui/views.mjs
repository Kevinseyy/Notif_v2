import {
  homeView,
  groupView,
  groupTitle,
  groupInfo,
  groupsList,
  activeGroupView,
  activeGroupTitle,
  logoutBtn,
  loginBtn,
  registerBtn,
  editAccountBtn,
  accountView,
} from "../utils/dom.mjs";

import { renderMember } from "./members.mjs";

import { currentUser, setStatus } from "../state/appState.mjs";

import { setCurrentGroup } from "../app.mjs";

export function goToGroupView(group) {
  homeView.style.display = "none";
  groupView.style.display = "none";
  accountView.style.display = "none";

  activeGroupView.style.display = "block";
  activeGroupTitle.textContent = group.name;

  setCurrentGroup(group);

  setStatus("BUSY");
  renderMember(currentUser.displayName, "BUSY");
}

export function addGroupTab(group) {
  const tab = document.createElement("div");
  tab.className = "group-tab";

  tab.innerHTML = `
      <strong>${group.name}</strong>
      <span>${group.memberCount} member</span>
    `;

  tab.addEventListener("click", () => goToGroupView(group));

  groupsList.prepend(tab);
}

export function goBackToDashboard() {
  activeGroupView.style.display = "none";
  accountView.style.display = "none";
  groupView.style.display = "flex";
}

export function showLoggedOutUI() {
  homeView.style.display = "flex";
  groupView.style.display = "none";
  activeGroupView.style.display = "none";
  accountView.style.display = "none";

  loginBtn.style.display = "block";
  registerBtn.style.display = "block";
  logoutBtn.style.display = "none";
  editAccountBtn.style.display = "none";
}

export function showLoggedInUI() {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";

  logoutBtn.style.display = "block";
  editAccountBtn.style.display = "block";
}
