CREATE TABLE "temp_tokens" (
    "token" text PRIMARY KEY NOT NULL,
    "id" integer NOT NULL,
    FOREIGN KEY ("id") REFERENCES "accounts"("id") ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO "temp_tokens" SELECT * FROM "tokens";
--> statement-breakpoint
DROP TABLE "tokens";
--> statement-breakpoint
CREATE TABLE "tokens" (
    "token" text PRIMARY KEY NOT NULL,
    "id" integer NOT NULL,
    FOREIGN KEY ("id") REFERENCES "accounts"("id") ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO "tokens" SELECT * FROM "temp_tokens";
--> statement-breakpoint
DROP TABLE "temp_tokens";