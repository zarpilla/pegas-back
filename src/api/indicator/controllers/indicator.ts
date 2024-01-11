/**
 * indicator controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::indicator.indicator');

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::indicator.indicator",
  ({ strapi }) => ({
    async findAllData(ctx) {
      const indicators = await strapi.db
        .query("api::indicator.indicator")
        .findMany({
          populate: [
            "sessions",
            "sessions.activity",
            "sessions.entities",
            "sessions.registrations",
          ],
        });

      const indicatorsCSV = [];
      for (const indicator of indicators) {
        for (const session of indicator.sessions) {
          const entities = session.entities
            .map((entity) => entity.name)
            .join(", ");
          const registrations = session.registrations.length;
          indicatorsCSV.push({
            indicator: indicator.name,
            activity: session.activity.name,
            session: session.name,
            date: session.date,
            entities,
            registrations,
          });
        }
      }

      if (ctx.query.format && ctx.query.format === "csv") {
        const items = indicatorsCSV;
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
          data: indicatorsCSV,
          meta: {
            pagination: { start: 0, limit: -1, total: indicatorsCSV.length },
          },
        };
      }
    },
  })
);
