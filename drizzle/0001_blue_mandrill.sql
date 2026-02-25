CREATE TABLE `demo_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(32) NOT NULL,
	`prospectName` varchar(255) NOT NULL,
	`prospectEmail` varchar(320) NOT NULL,
	`companyName` varchar(255),
	`maxViews` int NOT NULL DEFAULT 3,
	`viewsUsed` int NOT NULL DEFAULT 0,
	`expiryHours` int NOT NULL DEFAULT 48,
	`status` enum('active','expired','revoked','viewed') NOT NULL DEFAULT 'active',
	`createdAt` bigint NOT NULL,
	`expiresAt` bigint NOT NULL,
	CONSTRAINT `demo_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `demo_links_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `link_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`linkId` int NOT NULL,
	`viewedAt` bigint NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	CONSTRAINT `link_views_id` PRIMARY KEY(`id`)
);
