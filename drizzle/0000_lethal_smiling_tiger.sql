CREATE TABLE `Comment` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Passkey` (
	`id` text PRIMARY KEY NOT NULL,
	`public_key` blob NOT NULL,
	`user_id` text NOT NULL,
	`webauthn_user_id` text NOT NULL,
	`counter` integer NOT NULL,
	`device_type` text NOT NULL,
	`backed_up` integer NOT NULL,
	`transports` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Passkey_webauthn_user_id_unique` ON `Passkey` (`webauthn_user_id`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
