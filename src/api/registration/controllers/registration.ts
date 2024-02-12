/**
 * registration controller
 */

import { factories } from "@strapi/strapi";
import moment from "moment";

export default factories.createCoreController(
  "api::registration.registration",
  ({ strapi }) => ({
    async findAllRegistration(ctx) {
      const registrations = await strapi.db
        .query("api::registration.registration")
        .findMany({
          populate: ["session", "session.activity", "signature"],
        });

      const registrationsCSV = [];
      for (let i = 0; i < registrations.length; i++) {
        const registration = registrations[i];
        if (registration && registration.session && registration.session.id) {
            registration.session_name = registration.session.name
            if (registration && registration.session && registration.session.activity && registration.session.activity.id) {
                registration.activity_name = registration.session.activity.name
            }
        }
        if (registration && registration.signature && registration.signature.id) {
          registration.signature = process.env.URL + registration.signature.url
        }

        registration.createdAt = moment(registration.createdAt).format("YYYY-MM-DD HH:mm:ss")

        delete registration.session
        delete registration.id
        delete registration.uuid
        delete registration.datetime
        delete registration.updatedAt

        console.log("registration", registration);
        registrationsCSV.push(registration);
      }

      if (ctx.query.format && ctx.query.format === "csv") {
        const items = registrationsCSV;
        const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
        const header = Object.keys(items[0]);
        const csv = [
          header.join(","), // header row first
          ...items.map((row) =>
            header
              .map((fieldName) => JSON.stringify(row[fieldName], replacer))
              .join(",")
          ),
        ].join("\r\n");
        ctx.type = "text/csv";
        return csv;
      } else {
        return {
          data: registrationsCSV,
          meta: {
            pagination: { start: 0, limit: -1, total: registrationsCSV.length },
          },
        };
      }
    },
  })
);
