import Dexie from "dexie";
export const db = new Dexie("myDatabase");
db.version(1).stores({
  journals: "id, title, description",
  entries: "id, journalId, date, title, description, emotion"
});
