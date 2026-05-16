import { integer, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
})

export const permissions = pgTable('permissions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
})

export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
})

export const rolePermissions = pgTable('role_permissions', {
  roleId: integer().references(() => roles.id),
  permissionId: integer().references(() => permissions.id),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  primaryKey({ columns: [table.permissionId, table.roleId] })
])

export const userRoles = pgTable('user_roles', {
  userId: integer().references(() => users.id),
  roleId: integer().references(() => roles.id),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" })
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] })
])