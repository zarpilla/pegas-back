/**
 * registration router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/indicators/all",
      handler: "indicator.findAllData",
    },
  ],
};
