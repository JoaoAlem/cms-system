import { permissions, rolePermissions, roles } from "./db/schema"
import { db } from "./index"

async function main() {
    const permissionsAndRoles = await Promise.all([
        seedInitialPermissions(),
        seedInitialRoles()
    ])

    await seedRolesPermissions(permissionsAndRoles)
}

async function seedInitialPermissions() {
    return await db.insert(permissions).values([
        { name: "view_users" },
        { name: "create_users" },
        { name: "edit_users" },
        { name: "delete_users" },
        { name: "view_permissions" },
        { name: "create_permissions" },
        { name: "edit_permissions" },
        { name: "delete_permissions" },
        { name: "view_roles" },
        { name: "create_roles" },
        { name: "edit_roles" },
        { name: "delete_roles" },
    ]).onConflictDoNothing({
        target: permissions.name
    }).returning({ permissionId: permissions.id })
}

async function seedInitialRoles() {
    return await db.insert(roles).values([
        { name: "admin" },
    ]).onConflictDoNothing({
        target: roles.name
    }).returning({ roleId: roles.id })
}

type permissionsAndRoles = [{
    permissionId: number;
}[], {
    roleId: number;
}[]]

async function seedRolesPermissions(permissionsAndRoles: permissionsAndRoles) {
    const permissions = permissionsAndRoles[0]
    const roles = permissionsAndRoles[1]

    const values = permissions.map((permission) => {
        return {
            roleId: roles.at(0)?.roleId,
            permissionId: permission.permissionId
        }
    })

    return await db.insert(rolePermissions).values(values).onConflictDoNothing()
}

main();