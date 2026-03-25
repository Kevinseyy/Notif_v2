import { memberList } from "../utils/dom.mjs";

export function renderMember(name) {
  const el = document.createElement("div");
  el.className = "member";

  el.innerHTML = `
    <span class="member-name">${name}</span>
  `;

  memberList.appendChild(el);
}
