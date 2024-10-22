CREATE INDEX `issue_search_idx` ON `issue` (`organization_id`,`title`,`description`);--> statement-breakpoint
CREATE INDEX `comment_search_idx` ON `comment` (`issue_id`,`content`);