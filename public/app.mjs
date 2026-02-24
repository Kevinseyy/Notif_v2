// Remove "../src" because the 'src' folder is served as a root directory
import { createGroup, updateStatus } from "/api/groupApi.mjs";
import { currentUser, setStatus } from "/state/appState.mjs";
import {
  openCreateGroupModal,
  closeCreateGroupModal,
  setError,
} from "/ui/modals.mjs";

import { addGroupTab, goToGroupView } from "/ui/views.mjs";
import { renderMember } from "/ui/members.mjs";
import {
  createGroupBtn,
  submitCreateGroupBtn,
  groupNameInput,
  freeNowBtn,
} from "/utils/dom.mjs";

// Events
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
  const data = await updateStatus();
  const status = data.status === "FREE_NOW" ? "FREE" : "BUSY";
  setStatus(status);
  renderMember(currentUser.displayName, status);
});
