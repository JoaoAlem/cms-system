import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),

    roles: r.many.roles({
      from: r.user.id.through(r.userRoles.userId),
      to: r.roles.id.through(r.userRoles.roleId),
    }),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },

  roles: {
    users: r.many.user({
      from: r.roles.id.through(r.userRoles.roleId),
      to: r.user.id.through(r.userRoles.userId),
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
