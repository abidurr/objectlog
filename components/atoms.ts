import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Set the string key and the initial value
const darkModeAtom = atomWithStorage("darkMode", false);

const isLoggedInAtom = atomWithStorage("isLoggedIn", true);

const loggedInUserAtom = atomWithStorage("loggedInUser", {
  username: "admin",
  email: "admin@test.com",
  name: "Admin User",
});
