import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    roles: r.many.roles({
      from: r.users.id.through(r.userRoles.userId),
      to: r.roles.id.through(r.userRoles.roleId),
    }),
  },

  roles: {
    users: r.many.users({
      from: r.roles.id.through(r.userRoles.roleId),
      to: r.users.id.through(r.userRoles.userId),
    }),

    permissions: r.many.permissions({
      from: r.roles.id.through(r.rolePermissions.roleId),
      to: r.permissions.id.through(r.rolePermissions.permissionId),
    }),
  },

  permissions: {
    roles: r.many.roles({
      from: r.permissions.id.through(r.rolePermissions.permissionId),
      to: r.roles.id.through(r.rolePermissions.roleId),
    }),
  },
}));