import {
  createGroupModal,
  groupNameInput,
  createGroupError,
  joinGroupModal,
  groupCodeModal,
  changeUsernameModal,
  howItWorksModal,
  tosModal,
  privacyModal,
  loginModal,
  registerModal,
  closeJoinModalBtn,
  cancelJoinBtn,
  closeGroupCodeModalBtn,
  closeChangeUsernameModalBtn,
  cancelChangeUsernameBtn,
  closeHowItWorksModalBtn,
  closeTosModalBtn,
  closePrivacyModalBtn,
  closeLoginModalBtn,
  closeRegisterModalBtn,
  cancelCreateGroupBtn,
  closeCreateGroupModalBtn,
  howItWorksBtn,
  viewTosLink,
  viewPrivacyLink,
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

export function initModals() {
  closeJoinModalBtn.addEventListener("click", () => joinGroupModal.close());
  cancelJoinBtn.addEventListener("click", () => joinGroupModal.close());
  closeGroupCodeModalBtn.addEventListener("click", () =>
    groupCodeModal.close()
  );
  closeChangeUsernameModalBtn.addEventListener("click", () =>
    changeUsernameModal.close()
  );
  cancelChangeUsernameBtn.addEventListener("click", () =>
    changeUsernameModal.close()
  );
  howItWorksBtn.addEventListener("click", () => howItWorksModal.showModal());
  closeHowItWorksModalBtn.addEventListener("click", () =>
    howItWorksModal.close()
  );
  closeTosModalBtn.addEventListener("click", () => tosModal.close());
  closePrivacyModalBtn.addEventListener("click", () => privacyModal.close());
  closeLoginModalBtn.addEventListener("click", () => loginModal.close());
  closeRegisterModalBtn.addEventListener("click", () => registerModal.close());
  cancelCreateGroupBtn.addEventListener("click", () =>
    createGroupModal.close()
  );
  closeCreateGroupModalBtn.addEventListener("click", () =>
    createGroupModal.close()
  );

  viewTosLink.addEventListener("click", (e) => {
    e.preventDefault();
    tosModal.showModal();
  });

  viewPrivacyLink.addEventListener("click", (e) => {
    e.preventDefault();
    privacyModal.showModal();
  });

  [loginModal, registerModal, tosModal, privacyModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });
  });
}
