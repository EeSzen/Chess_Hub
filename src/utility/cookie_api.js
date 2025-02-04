export const getCurrentUser = (cookies) => {
  return cookies.currentUser ? cookies.currentUser : null;
};

export const isUserLoggedIn = (cookies) => {
  return getCurrentUser(cookies) ? true : false;
};

export const isAdmin = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.role === "admin" ? true : false;
};

// function to access function
export const getUserToken = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.token ? currentUser.token : "";
};

// function to get currentUser name via cookies
export const getUserName = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.name ? currentUser.name : "";
};
