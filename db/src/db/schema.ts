import { boolean, integer, index, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, table => [index("user_deleted_at_idx").on(table.deletedAt)]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, table => [index("session_user_id_idx").on(table.userId)]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
}, table => [index("account_user_id_idx").on(table.userId)]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, table => [index("verification_identifier_idx").on(table.identifier)]);

export const permissions = pgTable("permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" }),
}, table => [index("permissions_deleted_idx").on(table.deletedAt)]);

export const roles = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" }),
}, table => [index("roles_deleted_idx").on(table.deletedAt)]);

export const rolePermissions = pgTable("role_permissions", {
  roleId: integer().notNull().references(() => roles.id),
  permissionId: integer().notNull().references(() => permissions.id),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" }),
}, table => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
  index("role_permissions_role_id_idx").on(table.roleId),
  index("role_permissions_permission_id_idx").on(table.permissionId),
  index("role_permissions_permission_id_role_id_idx").on(table.permissionId, table.roleId),
  index("role_permissions_deleted_idx").on(table.deletedAt),
]);

export const userRoles = pgTable("user_roles", {
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  roleId: integer().notNull().references(() => roles.id),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
  index("user_roles_user_id_idx").on(table.userId),
  index("user_roles_role_id_idx").on(table.roleId),
  index("user_roles_role_id_user_id_idx").on(table.roleId, table.userId),
  index("user_roles_deleted_idx").on(table.deletedAt),
]);
