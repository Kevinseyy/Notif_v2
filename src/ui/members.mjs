import { memberList } from "../utils/dom.mjs";

export function renderMember(name, status) {
  memberList.innerHTML = "";

  const el = document.createElement("div");
  el.className = "member";

  el.innerHTML = `
    <span class="member-name">${name}</span>
    <span class="status-dot ${status === "FREE" ? "green" : "red"}"></span>
  `;

  memberList.appendChild(el);

  const dot = el.querySelector(".status-dot");
  if (status === "FREE") {
    dot.classList.add("jump");
  }
}
