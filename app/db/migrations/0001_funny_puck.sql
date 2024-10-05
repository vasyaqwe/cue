ALTER TABLE `notification` ADD `comment_id` text REFERENCES comment(id);--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS delete_comment_notifications
    AFTER DELETE ON comment
    FOR EACH ROW
    BEGIN
      DELETE FROM notification WHERE comment_id = OLD.id;
    END;