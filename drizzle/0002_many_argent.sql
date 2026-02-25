CREATE TABLE `admin_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`username` varchar(64) NOT NULL,
	`createdAt` bigint NOT NULL,
	`expiresAt` bigint NOT NULL,
	CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
