CREATE TABLE `bookmarks` (
	`post` integer NOT NULL,
	`user` integer NOT NULL,
	FOREIGN KEY (`post`) REFERENCES `posts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`original_post` integer NOT NULL,
	`comment` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`original_post`) REFERENCES `posts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`comment`) REFERENCES `posts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`post` integer NOT NULL,
	`user` integer NOT NULL,
	FOREIGN KEY (`post`) REFERENCES `posts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY DEFAULT NULL NOT NULL,
	`content` text,
	`image_path` text,
	`poster` integer,
	`likes` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`poster`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY DEFAULT NULL NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`picture` text DEFAULT '',
	`bio` text DEFAULT '',
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`id` integer,
	FOREIGN KEY (`id`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_username_unique` ON `accounts` (`username`);