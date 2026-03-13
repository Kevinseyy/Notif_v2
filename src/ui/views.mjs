import {
  homeView,
  groupView,
  groupTitle,
  groupInfo,
  groupsList,
  activeGroupView,
  activeGroupTitle,
  logoutBtn,
} from "../utils/dom.mjs";

import { renderMember } from "./members.mjs";

import { currentUser, setStatus } from "../state/appState.mjs";

export function goToGroupView(group) {
  homeView.style.display = "none";
  groupView.style.display = "none";

  activeGroupView.style.display = "block";
  groupTitle.textContent = group.name;
  groupInfo.textContent = `Group ID: ${group.groupId} • Members: ${group.memberCount}`;

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
  groupView.style.display = "flex";
}

export function showLoggedOutUI() {
  homeView.style.display = "flex";
  groupView.style.display = "none";
  activeGroupView.style.display = "none";

  loginBtn.style.display = "block";
  registerBtn.style.display = "block";
  logoutBtn.style.display = "none";
}

export function showLoggedInUI() {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";
  logoutBtn.style.display = "block";
}
