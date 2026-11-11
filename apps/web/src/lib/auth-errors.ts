/**
 * Maps Better Auth / Google OAuth error codes to user-readable messages.
 * The ?error= query param from the OAuth callback is validated against
 * this allowlist — unknown values fall back to the generic message.
 */

const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  OAuthCallbackError:
    "Sign-in failed during the Google callback. Please try again.",
  OAuthSignInError:
    "Could not start the Google sign-in flow. Please try again.",
  OAuthAccountNotLinked:
    "This Google account is not linked to any account. Please contact support.",
  AccessDenied:
    "You denied access to your Google account. Sign-in requires Google access.",
  Configuration:
    "The sign-in provider is not configured correctly. Please contact support.",
  Verification: "The sign-in link has expired. Please request a new one.",
};

const GENERIC_MESSAGE = "Sign-in failed. Please try again.";

/**
 * Returns a human-readable error message for a given OAuth error code.
 * Always returns a string — never throws.
 */
export function getAuthErrorMessage(errorCode: string | null | undefined): string {
  if (!errorCode) return GENERIC_MESSAGE;
  return KNOWN_ERROR_MESSAGES[errorCode] ?? GENERIC_MESSAGE;
}

/**
 * Returns true if the given string is a recognised OAuth error code.
 */
export function isKnownAuthError(errorCode: string): boolean {
  return Object.prototype.hasOwnProperty.call(KNOWN_ERROR_MESSAGES, errorCode);
}
