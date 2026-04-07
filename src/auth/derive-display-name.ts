const EMAIL_NAME_DELIMITER = /[._+-]+/;

function capitalizeToken(token: string) {
  if (!token) {
    return "";
  }

  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function deriveDisplayNameFromEmail(email: string) {
  const localPart = email.split("@")[0]?.trim() ?? "";

  const tokens = localPart
    .split(EMAIL_NAME_DELIMITER)
    .map((token) => token.trim())
    .filter(Boolean)
    .map(capitalizeToken);

  if (tokens.length === 0) {
    return "TinyNotes User";
  }

  return tokens.join(" ");
}
