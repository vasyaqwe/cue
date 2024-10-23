CREATE TABLE `favorite` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `favorite_organization_id_idx` ON `favorite` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `favorite_unique_idx` ON `favorite` (`user_id`,`entity_type`,`entity_id`);