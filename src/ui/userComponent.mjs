class UserActions extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <button class="ghost-btn" id="loginBtn" data-i18n="login">LOGIN</button>
        <button class="ghost-btn" id="registerBtn" data-i18n="register">REGISTER</button>
        <button class="ghost-btn" id="editAccountBtn" data-i18n="edit" style="display:none;">EDIT</button>
        <button class="ghost-btn" id="logoutBtn" data-i18n="logOut" style="display:none;">LOG OUT</button>
      `;
  }
}

customElements.define("user-actions", UserActions);
