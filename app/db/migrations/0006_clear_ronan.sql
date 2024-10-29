DROP INDEX IF EXISTS `oauth_account_provider_user_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_account_provider_user_id_unique` ON `oauth_account` (`provider_user_id`);