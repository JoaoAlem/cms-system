import { permissions, rolePermissions, roles } from "./db/schema.js"
import { db } from "./index.js"

async function main() {
    const permissionsAndRoles = await Promise.all([
        seedPermissions(),
        seedInitialRoles()
    ])

    await seedRolesPermissions(permissionsAndRoles)
}

async function seedPermissions() {
    const names = [
        "view_users", "create_users", "edit_users", "delete_users",
        "view_permissions", "create_permissions", "edit_permissions", "delete_permissions",
        "view_roles", "create_roles", "edit_roles", "delete_roles",
    ];

    await db.insert(permissions).values([
        { name: "view_users", title: "Ver usuários" },
        { name: "create_users", title: "Criar usuários" },
        { name: "edit_users", title: "Editar usuários" },
        { name: "delete_users", title: "Remover usuários" },
        { name: "view_permissions", title: "Ver permissões" },
        { name: "create_permissions", title: "Criar permissões" },
        { name: "edit_permissions", title: "Editar permissões" },
        { name: "delete_permissions", title: "Remover permissões" },
        { name: "view_roles", title: "Ver cargos" },
        { name: "create_roles", title: "Criar cargos" },
        { name: "edit_roles", title: "Editar cargos" },
        { name: "delete_roles", title: "Remover cargos" },
    ]).onConflictDoNothing({
        target: permissions.name
    });

    return db.query.permissions.findMany({
        columns: { id: true, name: true },
        where: { name: { in: names } },
    }).then(rows => rows.map(({ id: permissionId }) => ({ permissionId })));
}

async function seedInitialRoles() {
    await db.insert(roles).values([
        { name: "admin", title: "Administrador"},
    ]).onConflictDoNothing({
        target: roles.name
    });

    return db.query.roles.findMany({
        columns: { id: true, name: true },
        where: { name: { in: ["admin"] } },
    }).then(rows => rows.map(({ id: roleId }) => ({ roleId })));
}

type permissionsAndRoles = [{
    permissionId: number;
}[], {
    roleId: number;
}[]]


async function seedRolesPermissions(permissionsAndRoles: permissionsAndRoles) {
    const permissions = permissionsAndRoles[0]
    const roles = permissionsAndRoles[1]

    const adminRole = roles.at(0)
    if (!adminRole) {
        throw new Error("Role admin não encontrado.")
    }

    const values = permissions.map((permission) => {
        return {
            roleId: adminRole.roleId,
            permissionId: permission.permissionId,
        }
    })

    return await db.insert(rolePermissions).values(values).onConflictDoNothing()
}

main();
