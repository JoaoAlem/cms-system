ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_roleId_pk";--> statement-breakpoint
ALTER TABLE "role_permissions" ADD PRIMARY KEY ("roleId","permissionId");--> statement-breakpoint
CREATE INDEX "permissions_deleted_idx" ON "permissions" ("deletedAt");--> statement-breakpoint
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions" ("roleId");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" ("permissionId");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_role_id_idx" ON "role_permissions" ("permissionId","roleId");--> statement-breakpoint
CREATE INDEX "role_permissions_deleted_idx" ON "role_permissions" ("deletedAt");--> statement-breakpoint
CREATE INDEX "roles_deleted_idx" ON "roles" ("deletedAt");--> statement-breakpoint
CREATE INDEX "user_roles_user_id_idx" ON "user_roles" ("userId");--> statement-breakpoint
CREATE INDEX "user_roles_role_id_idx" ON "user_roles" ("roleId");--> statement-breakpoint
CREATE INDEX "user_roles_role_id_user_id_idx" ON "user_roles" ("roleId","userId");--> statement-breakpoint
CREATE INDEX "user_roles_deleted_idx" ON "user_roles" ("deletedAt");--> statement-breakpoint
CREATE INDEX "users_deleted_idx" ON "users" ("deletedAt");