import argon2 from "argon2"
import { db } from "../../src/index"
import { account, user } from "../../src/db/schema"
import { parseArgs } from "util";
import { randomUUID } from "crypto";

async function createNewUser(name: string, email: string, plainPassword: string) {
    const hashedPassword = await argon2.hash(plainPassword);

    const userId = randomUUID();

    await db.insert(user).values({
        id: userId,
        name,
        email,
    });

    await db.insert(account).values({
        id: randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
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
