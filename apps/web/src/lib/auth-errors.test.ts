import { describe, it, expect } from "vitest";
import { getAuthErrorMessage, isKnownAuthError } from "./auth-errors";

describe("getAuthErrorMessage", () => {
  it("returns a specific message for OAuthCallbackError", () => {
    const msg = getAuthErrorMessage("OAuthCallbackError");
    expect(msg).toContain("callback");
    expect(msg.length).toBeGreaterThan(10);
  });

  it("returns a specific message for OAuthSignInError", () => {
    const msg = getAuthErrorMessage("OAuthSignInError");
    expect(msg).toContain("sign-in");
  });

  it("returns a specific message for OAuthAccountNotLinked", () => {
    const msg = getAuthErrorMessage("OAuthAccountNotLinked");
    expect(msg).toContain("not linked");
  });

  it("returns a specific message for AccessDenied", () => {
    const msg = getAuthErrorMessage("AccessDenied");
    expect(msg).toContain("denied");
  });

  it("returns the generic message for an unknown error code", () => {
    const msg = getAuthErrorMessage("SomeRandomCode");
    expect(msg).toBe("Sign-in failed. Please try again.");
  });

  it("returns the generic message for an empty string", () => {
    const msg = getAuthErrorMessage("");
    expect(msg).toBe("Sign-in failed. Please try again.");
  });

  it("returns the generic message for null", () => {
    const msg = getAuthErrorMessage(null);
    expect(msg).toBe("Sign-in failed. Please try again.");
  });

  it("returns the generic message for undefined", () => {
    const msg = getAuthErrorMessage(undefined);
    expect(msg).toBe("Sign-in failed. Please try again.");
  });
});

describe("isKnownAuthError", () => {
  it("returns true for known error codes", () => {
    expect(isKnownAuthError("OAuthCallbackError")).toBe(true);
    expect(isKnownAuthError("AccessDenied")).toBe(true);
    expect(isKnownAuthError("Configuration")).toBe(true);
  });

  it("returns false for unknown error codes", () => {
    expect(isKnownAuthError("SomeRandomCode")).toBe(false);
    expect(isKnownAuthError("")).toBe(false);
  });
});
