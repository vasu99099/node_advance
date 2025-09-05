import { publish } from "./producer.js";

export async function emitUserRegistered(user) {
  await publish("user.registered", {
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
