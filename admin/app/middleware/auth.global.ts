export default defineNuxtRouteMiddleware((to, from) => {
  // TODO - Early return in another routes when user has session
  
  if (to.path === "/login") {
    return;
  }

  return navigateTo("/login");
});
