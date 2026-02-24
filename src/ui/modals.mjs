import {
  createGroupModal,
  groupNameInput,
  createGroupError,
} from "../utils/dom.mjs";

export function setError(msg = "") {
  createGroupError.textContent = msg;
}

export function openCreateGroupModal() {
  setError("");
  groupNameInput.value = "";
  createGroupModal.showModal();
  setTimeout(() => groupNameInput.focus(), 0);
}

export function closeCreateGroupModal() {
  createGroupModal.close();
}
