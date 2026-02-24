import {
  homeView,
  groupView,
  groupTitle,
  groupInfo,
  groupsList,
} from "../utils/dom.mjs";

import { renderMember } from "./members.mjs";

import { currentUser, setStatus } from "../state/appState.mjs";

export function goToGroupView(group) {
  homeView.style.display = "none";
  groupView.style.display = "grid";

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
