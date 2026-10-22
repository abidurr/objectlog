import { atomWithStorage } from "jotai/utils";

// Set the string key and the initial value
export const darkModeAtom = atomWithStorage("darkMode", false);

export const isLoggedInAtom = atomWithStorage("isLoggedIn", true);

export const loggedInUserAtom = atomWithStorage("loggedInUser", {
  username: "admin",
  email: "admin@test.com",
  name: "Admin User",
});
