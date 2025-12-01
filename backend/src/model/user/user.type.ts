import { Role } from "@prisma/client";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
};
