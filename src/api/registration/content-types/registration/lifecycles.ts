import { v4 as uuidv4 } from "uuid";
const { ApplicationError } = require('@strapi/utils').errors;

export default {
  async beforeCreate(event) {
    event.params.data.uuid = uuidv4();
    event.params.data.datetime = new Date();

    if (event.params.data.name === '' && event.params.data.email !== ''){
      const registrations = await strapi.query('api::registration.registration').findMany({where:{email: event.params.data.email}})
      if (registrations.length > 0) {
        const lastRegistration = registrations[registrations.length - 1];
        event.params.data.name = lastRegistration.name;
        event.params.data.lastname = lastRegistration.lastname;
        event.params.data.identification = lastRegistration.identification;
        event.params.data.birthdate = lastRegistration.birthdate;
        event.params.data.municipality = lastRegistration.municipality;
        event.params.data.municipality = lastRegistration.municipality;
        event.params.data.sex = lastRegistration.sex;
        event.params.data.gender = lastRegistration.gender;
        event.params.data.drets = lastRegistration.drets;
        event.params.data.phone = lastRegistration.phone;
      }
      else {
        throw new ApplicationError("No s'ha trobat cap inscripció prèvia amb aquest correu electrònic.", 403);
      }
    }
  },
};
