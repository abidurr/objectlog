import { atomWithStorage } from "jotai/utils";

// Set the string key and the initial value
export const darkModeAtom = atomWithStorage("darkMode", false);

export const isLoggedInAtom = atomWithStorage("isLoggedIn", true);

export const loggedInUserAtom = atomWithStorage("loggedInUser", {
  id: "6ad9ab16b5405f26eef8a91f",
  username: "admin",
  email: "admin@test.com",
  name: "Admin User",
});
