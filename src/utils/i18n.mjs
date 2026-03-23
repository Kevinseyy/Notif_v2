const translations = {
  en: {
    usernameTaken: "Username already taken",
    userNotFound: "User not found",
    incorrectPassword: "Incorrect password",
    tosRequired: "You must agree to the Terms of Service.",
    groupNameShort: "Group name must be at least 2 characters.",
    invalidCode: "Invalid code",
    enterCode: "Please enter a code.",
    registrationFailed: "Registration failed",
    loginFailed: "Login failed",
    updateFailed: "Update failed",
    deleteConfirm: "Are you sure? This will permanently delete your account.",
    deleteGroupConfirm: "Are you sure you want to delete this group?",
    accountDeleted: "Your account has been deleted.",
    usernameUpdated: "Username updated!",
    errorOccurred: "An error occurred. Please try again.",
    deleteAccountFailed: "Failed to delete account",
    deleteGroupFailed: "Failed to delete group",
  },
  no: {
    usernameTaken: "Brukernavnet er allerede tatt",
    userNotFound: "Bruker ikke funnet",
    incorrectPassword: "Feil passord",
    tosRequired: "Du må godta vilkårene for bruk.",
    groupNameShort: "Gruppenavnet må være minst 2 tegn.",
    invalidCode: "Ugyldig kode",
    enterCode: "Vennligst skriv inn en kode.",
    registrationFailed: "Registrering mislyktes",
    loginFailed: "Innlogging mislyktes",
    updateFailed: "Oppdatering mislyktes",
    deleteConfirm: "Er du sikker? Dette vil slette kontoen din permanent.",
    deleteGroupConfirm: "Er du sikker på at du vil slette denne gruppen?",
    accountDeleted: "Kontoen din har blitt slettet.",
    usernameUpdated: "Brukernavn oppdatert!",
    errorOccurred: "En feil oppstod. Vennligst prøv igjen.",
    deleteAccountFailed: "Kunne ikke slette konto",
    deleteGroupFailed: "Kunne ikke slette gruppe",
  },
  ja: {
    usernameTaken: "このユーザー名はすでに使われています",
    userNotFound: "ユーザーが見つかりません",
    incorrectPassword: "パスワードが間違っています",
    tosRequired: "利用規約に同意する必要があります。",
    groupNameShort: "グループ名は2文字以上必要です。",
    invalidCode: "無効なコードです",
    enterCode: "コードを入力してください。",
    registrationFailed: "登録に失敗しました",
    loginFailed: "ログインに失敗しました",
    updateFailed: "更新に失敗しました",
    deleteConfirm: "本当に削除しますか？アカウントが完全に削除されます。",
    deleteGroupConfirm: "このグループを削除してもよろしいですか？",
    accountDeleted: "アカウントが削除されました。",
    usernameUpdated: "ユーザー名を更新しました！",
    errorOccurred: "エラーが発生しました。もう一度お試しください。",
    deleteAccountFailed: "アカウントの削除に失敗しました",
    deleteGroupFailed: "グループの削除に失敗しました",
  },
};

function detectLang() {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;

  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn"))
    return "no";
  if (lang.startsWith("ja")) return "ja";
  return "en";
}

export let currentLang = detectLang();

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
}

export function t(key) {
  return translations[currentLang][key] || translations["en"][key] || key;
}
