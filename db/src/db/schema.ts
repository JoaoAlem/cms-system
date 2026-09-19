import { integer, pgTable, index, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  index("users_deleted_idx").on(table.deletedAt)
])

export const permissions = pgTable('permissions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  index("permissions_deleted_idx").on(table.deletedAt)
])

export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  index("roles_deleted_idx").on(table.deletedAt)
])

export const rolePermissions = pgTable('role_permissions', {
  roleId: integer().notNull().references(() => roles.id),
  permissionId: integer().notNull().references(() => permissions.id),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
  index("role_permissions_role_id_idx").on(table.roleId),
  index("role_permissions_permission_id_idx").on(table.permissionId),
  index("role_permissions_permission_id_role_id_idx").on(table.permissionId, table.roleId),
  index("role_permissions_deleted_idx").on(table.deletedAt)
])

export const userRoles = pgTable('user_roles', {
  userId: integer().notNull().references(() => users.id),
  roleId: integer().notNull().references(() => roles.id),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
  index("user_roles_user_id_idx").on(table.userId),
  index("user_roles_role_id_idx").on(table.roleId),
  index("user_roles_role_id_user_id_idx").on(table.roleId, table.userId),
  index("user_roles_deleted_idx").on(table.deletedAt)
])
