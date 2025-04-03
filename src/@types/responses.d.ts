declare interface PagingWrapper<T> {
	content: Array<T>;
	first?: boolean;
	last?: boolean;
	number: number;
	size: number;
	numberOfElements: number;
	totalElements: number;
	totalPages?: number;
}

declare interface FileMetadataResponse {
	id: string;
	name: string;
	size: number;
	createdAtMs: number;
	mimeType: string;
}

declare interface CustomerResponse {
	id: string;
	name: string;
	email: string;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareVersionResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface ModuleResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface ModuleVersionResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface DeploymentProcessResponse {
	id: number;
	status: DeploymentProcessStatus;
	createdAtMs: number;
	updatedAtMs?: number?;
	software: {
		name: string;
		versionName: string;
	};
	customer: {
		name: string;
	};
}

declare interface ModuleInDeploymentProcessResponse {
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

declare interface DeploymentProcessMemberResponse {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

declare interface DeploymentPhaseResponse {
	id: string;
	numOrder: number;
	description: string?;
	createdAtMs: number;
	updatedAtMs?: number?;
	type: {
		name: string;
	};
	plannedStartDate: string;
	plannedEndDate: string;
	actualStartDate: string?;
	actualEndDate: string?;
	isDone: boolean;
	userLastUpdatedId: string?;
}

declare interface DeploymentPhaseUpdateHistoryResponse {
	id: {
		numOrder: number;
		userIdPerformed: string;
		phaseId: string;
	};
	phaseType: {
		name: string;
	};
	description: string?;
	isDone: boolean;
	updatedAt: number;
}

declare interface DeploymentPhaseTypeResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface ErrorResponse {
	status: number;
	errorKey: string;
	severity?: 'warn' | 'error';
}

declare interface DocumentTypeResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareDocumentResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
	type: { name: string };
	version: { name: string };
}

declare interface ModuleDocumentResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
	type: { name: string };
	version: { name: string };
}

declare interface MailTemplateResponse {
	id: string;
	subject: string;
	content: string;
	type: MailTemplateType;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface UserRepresentation {
	id: string;
	username: string?;
	firstName: string?;
	lastName: string?;
	email: string?;
}

declare interface NotificationResponse {
	id: number;
	title: string;
	description: string?;
	createdAtMillis: number;
}

declare interface NotificationHistoryResponse {
	numOrder: number;
	userId: string;
	notification: {
		id: number;
		title: string;
		description: string?;
	};
	createdAtMillis: number;
	updatedAtMillis: number?;
	isRead: boolean;
}

declare interface SoftwareLicenseResponse {
	id: string;
	description: string?;
	startTimeMs: number;
	endTimeMs: number;
	expireAlertIntervalDay: number;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareLicenseDetailResponse {
	id: string;
	description: string?;
	startTimeMs: number;
	endTimeMs: number;
	expireAlertIntervalDay: number;
	isExpireAlertDone: boolean;
	createdAtMs: number;
	updatedAtMs: number?;
	process: {
		id: number;
		softwareVersionId: string;
		softwareVersionName: string;
		customerId: string;
		customerName: string;
		customerEmail: string;
		creatorId: string;
	};
	licenseCreatorId: string;
}
