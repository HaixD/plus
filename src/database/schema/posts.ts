import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { accounts } from "./users"

export const posts = sqliteTable("posts", {
    id: integer("id")
        .default(sql`NULL`)
        .primaryKey(),
    content: text("content"),
    imagePath: text("image_path"),
    poster: integer("poster").references(() => accounts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    likes: integer("likes").notNull().default(0),
})

export const comments = sqliteTable("comments", {
    originalPost: integer("original_post")
        .references(() => posts.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .notNull(),
    comment: integer("comment")
        .references(() => posts.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .primaryKey(),
})

export const likes = sqliteTable("likes", {
    post: integer("post")
        .references(() => posts.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .notNull(),
    user: integer("user")
        .references(() => accounts.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .notNull(),
})

export const bookmarks = sqliteTable("bookmarks", {
    post: integer("post")
        .references(() => posts.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .notNull(),
    user: integer("user")
        .references(() => accounts.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        .notNull(),
})
