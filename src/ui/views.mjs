import {
  homeView,
  groupView,
  groupsList,
  memberList,
  activeGroupView,
  activeGroupTitle,
  logoutBtn,
  loginBtn,
  registerBtn,
  editAccountBtn,
  accountView,
} from "../utils/dom.mjs";

import { getMembers } from "../api/groupApi.mjs";
import { renderMember } from "./members.mjs";
import { currentUser } from "../state/appState.mjs";
import { setCurrentGroup, checkFreeButton } from "../app.mjs";

export async function goToGroupView(group) {
  homeView.style.display = "none";
  groupView.style.display = "none";
  accountView.style.display = "none";

  activeGroupView.style.display = "block";
  activeGroupTitle.textContent = group.name;

  setCurrentGroup(group);

  memberList.innerHTML = "";

  try {
    const members = await getMembers(group.id);
    members.forEach((member) => {
      renderMember(member.username);
    });
  } catch (err) {
    console.error("Could not load members:", err);
  }

  checkFreeButton(group.id);
}

export function addGroupTab(group) {
  const existing = document.querySelector(`[data-group-id="${group.id}"]`);
  if (existing) return;

  const tab = document.createElement("div");
  tab.className = "group-tab";
  tab.dataset.groupId = group.id;

  tab.innerHTML = `<strong>${group.name}</strong>`;
  tab.addEventListener("click", async () => await goToGroupView(group));
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
