/**
 * registration router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/registration/all",
      handler: "registration.findAllRegistration",
    },
  ],
};
