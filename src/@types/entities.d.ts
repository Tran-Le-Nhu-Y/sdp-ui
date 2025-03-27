declare type ResourceRoles = 'software_admin' | 'deployment_person';

declare interface UserMetadata {
	id: string;
	firstName: string?;
	lastName: string?;
	email: string?;
}

declare interface FileMetadata {
	id: string;
	name: string;
	size: number;
	createdAt: string;
	mimeType: string;
}

declare type FileOperator = 'ADD' | 'REMOVE';

declare interface SdpDocumentType {
	id: string;
	name: string;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
}

declare interface Customer {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt?: string?;
}

declare interface Software {
	id: string;
	name: string;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
}

declare interface SoftwareVersion {
	id: string;
	name: string;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
}

declare interface SoftwareAndVersion {
	versionId: string;
	versionName: string;
	softwareId: string;
	softwareName: string;
}

declare interface Module {
	id: string;
	name: string;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
}

declare interface ModuleVersion {
	id: string;
	name: string;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
}

declare interface ModuleAndVersion {
	versionId: string;
	versionName: string;
	moduleId: string;
	moduleName: string;
}

declare interface DeploymentProcess {
	id: number;
	status: DeploymentProcessStatus;
	createdAt: string;
	updatedAt?: string?;
	software: {
		name: string;
		version: string;
	};
	customer: {
		name: string;
	};
}

declare type DeploymentProcessStatus =
	| 'INIT'
	| 'PENDING'
	| 'IN_PROGRESS'
	| 'DONE';

declare interface ModuleInDeploymentProcess {
	processId: number;
	version: {
		id: string;
		name: string;
	};
	module: {
		id: string;
		name: string;
	};
}

declare interface DeploymentPhaseType {
	id: string;
	name: string;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
}

declare interface DeploymentPhase {
	id: string;
	numOrder: number;
	description?: string?;
	createdAt: string;
	updatedAt?: string?;
	type: {
		name: string;
	};
	plannedStartDate: string;
	plannedEndDate: string;
	actualStartDate: string?;
	actualEndDate: string?;
	isDone: boolean;
	lastUpdatedByUserId?: string?;
}

declare interface SoftwareDocument {
	id: string;
	typeName: string;
	name: string;
	description: string?;
	createdAt: string;
	updatedAt: string?;
}
declare interface ModuleDocument {
	id: string;
	typeName: string;
	name: string;
	description: string?;
	createdAt: string;
	updatedAt: string?;
}

declare type MailTemplateType =
	| 'SOFTWARE_EXPIRE_ALERT'
	| 'SOFTWARE_DEPLOYED_SUCCESSFULLY';

declare interface MailTemplate {
	id: string;
	subject: string;
	content: string;
	type: MailTemplateType;
	createdAt: string;
	updatedAt: string?;
}

declare interface SdpNotification {
	id: number;
	title: string;
	description: string?;
	createdAt: string;
}

declare interface NotificationHistory {
	numOrder: number;
	notification: {
		id: number;
		title: string;
		description: string?;
	};
	createdAtMs: number;
	isRead: boolean;
}
