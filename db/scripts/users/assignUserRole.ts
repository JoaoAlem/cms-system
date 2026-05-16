import { db } from "../../src/index"
import { userRoles } from "../../src/db/schema"
import { parseArgs } from "util";

async function assignUserToRole(usernameOrEmail: string, role: string) {
    const userEntity = await db.query.users.findFirst({
        columns: { id: true },
        where: (users, { or, eq, and, isNull }) =>
            and(
                or(
                    eq(users.name, usernameOrEmail),
                    eq(users.email, usernameOrEmail)
                ),
                isNull(users.deletedAt)
            )
    })

    const roleEntity = await db.query.roles.findFirst({
        columns: {
            id: true
        },
        where: (roles, { eq, and, isNull }) => {
            and(
                eq(roles.name, role),
                isNull(roles.deletedAt)
            )
        }
    })

    if (!userEntity?.id || !roleEntity?.id) {
        throw new Error("Usuário ou cargo não encontrados.")
    }

    await db.insert(userRoles).values({
        roleId: roleEntity.id,
        userId: userEntity.id
    }).onConflictDoNothing()
}

async function main() {
    const { values } = parseArgs({
        args: process.argv,
        options: {
            identifier: {
                type: "string",
                multiple: false,
            },
            role: {
                type: "string",
                multiple: false,
            }
        },
        strict: true,
        allowPositionals: true,
    });

    try {
        if (!values?.identifier || !values.role) {
            throw new Error("Todos os argumentos são obrigatórios. Uso da função: bun --bun run scripts/users/assignUserRole.ts --identifier {{user_or_email}} --role {{role_name}}")
        }
        await assignUserToRole(values.identifier, values.role)
    } catch (e) {
        console.error(e?.toString())
        return 1;
    }

    console.log(`Usuário ${values.identifier} adicionado ao cargo ${values.role} com sucesso`)
    return 0;
}

await main()