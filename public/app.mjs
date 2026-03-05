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
  loginBtn,
  registerBtn,
  loginModal,
  registerModal,
  closeLoginModalBtn,
  closeRegisterModalBtn,
  submitRegisterBtn,
  tosConsent,
  viewTosLink,
  viewPrivacyLink,
  tosModal,
  privacyModal,
  closeTosModalBtn,
  closePrivacyModalBtn,
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

loginBtn.addEventListener("click", () => loginModal.showModal());
registerBtn.addEventListener("click", () => registerModal.showModal());

closeLoginModalBtn.addEventListener("click", () => loginModal.close());
closeRegisterModalBtn.addEventListener("click", () => registerModal.close());

submitRegisterBtn.addEventListener("click", async () => {
  if (!tosConsent.checked) {
    alert("You must agree to the Terms of Service to create an account.");
    return;
  }

  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

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
