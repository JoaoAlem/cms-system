import argon2 from "argon2"
import { db } from "../../src/index"
import { users } from "../../src/db/schema"
import { parseArgs } from "util";

async function createNewUser(name: string, email: string, plainPassword: string) {
    const hashedPassword = await argon2.hash(plainPassword);

    await db.execute(`select setval('users_id_seq', (select max(id) from users));`)

    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
    });
}

async function main() {
    const { values } = parseArgs({
        args: process.argv,
        options: {
            user: {
                type: "string",
                multiple: false,
            },
            email: {
                type: "string",
                multiple: false,
            },
            password: {
                type: "string",
                multiple: false,
            },
        },
        strict: true,
        allowPositionals: true,
    });

    try {
        if (!values?.user || !values.email || !values.password) {
            throw new Error("Todos os argumentos são obrigatórios. Uso da função: bun --bun run scripts/users/addUser.ts --user {{user}} --email {{email}} --password {{password}}")
        }
        await createNewUser(values.user, values.email, values.password)
    } catch (e) {
        console.error(e?.toString())
        return 1;
    }

    console.log("Usuário criado com sucesso")
    return 0;
}

await main()
