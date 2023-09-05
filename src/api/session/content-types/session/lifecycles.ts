import { v4 as uuidv4 } from "uuid";

export default {
  beforeCreate(event) {
    event.params.data.uuid = uuidv4();
  },
};
