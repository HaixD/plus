import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const accounts = sqliteTable("accounts", {
    id: integer("id")
        .default(sql`NULL`)
        .primaryKey(),
    username: text("username").unique().notNull(),
    password: text("password").notNull(),
})

export const tokens = sqliteTable("tokens", {
    token: text("token").primaryKey(),
    id: integer("id")
        .notNull()
        .references(() => accounts.id, {
            onUpdate: "cascade",
            onDelete: "cascade",
        }),
})

export const profiles = sqliteTable("profiles", {
    picture: text("picture").default(""),
    bio: text("bio").default(""),
    id: integer("id")
        .primaryKey()
        .references(() => accounts.id, {
            onUpdate: "cascade",
            onDelete: "cascade",
        }),
})
