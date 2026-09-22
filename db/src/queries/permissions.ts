import {
  and,
  countDistinct,
  eq,
  inArray,
  isNull,
} from "drizzle-orm";

import { db } from "../client.js";
import {
  permissions,
  rolePermissions,
  userRoles,
} from "../db/schema.js";

export async function checkUserPermissions(
  userId: string,
  requiredPermissions: string | string[],
): Promise<boolean> {
  const names = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  if (names.length === 0) {
    return true;
  }

  const [result] = await db
    .select({
      total: countDistinct(permissions.name),
    })
    .from(userRoles)
    .innerJoin(
      rolePermissions,
      eq(rolePermissions.roleId, userRoles.roleId),
    )
    .innerJoin(
      permissions,
      eq(permissions.id, rolePermissions.permissionId),
    )
    .where(
      and(
        eq(userRoles.userId, userId),
        inArray(permissions.name, names),
        isNull(userRoles.deletedAt),
        isNull(rolePermissions.deletedAt),
        isNull(permissions.deletedAt),
      ),
    );

  return Number(result?.total ?? 0) === names.length;
}
