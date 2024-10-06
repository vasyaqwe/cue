DROP INDEX IF EXISTS `comment_organization_id_idx`;--> statement-breakpoint
ALTER TABLE `comment` ADD `resolved_by_id` text REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `comment_issue_id_idx` ON `comment` (`issue_id`);