declare interface CustomerCreateRequest {
	name: string;
	email: string;
	userId: string;
}

declare interface CustomerUpdateRequest {
	name: string;
	email: string;
	customerId: string;
}

declare interface SoftwareCreateRequest {
	name: string;
	description?: string?;
	userId: string;
}

declare interface SoftwareUpdateRequest {
	name: string;
	description?: string?;
	softwareId: string;
}

declare interface SoftwareVersionCreateRequest {
	name: string;
	description?: string?;
	softwareId: string;
}

declare interface SoftwareVersionUpdateRequest {
	name: string;
	description?: string?;
	versionId: string;
}

declare interface ModuleCreateRequest {
	name: string;
	description?: string?;
	softwareVersionId: string;
}

declare interface ModuleUpdateRequest {
	name: string;
	description?: string?;
	moduleId: string;
}

declare interface ModuleVersionCreateRequest {
	name: string;
	description?: string?;
	moduleId: string;
}

declare interface ModuleVersionUpdateRequest {
	name: string;
	description?: string?;
	moduleVersionId: string;
}

declare interface DeploymentProcessCreateRequest {
	userId: string;
	softwareVersionId: string;
	customerId: string;
	memberIds?: string[]?;
}

declare interface DeploymentProcessUpdateRequest {
	processId: number;
	status: DeploymentProcessStatus;
}

declare interface DeploymentProcessUpdateRequest {
	processId: number;
	memberId: string;
	operator: 'ADD' | 'REMOVE';
}

declare interface DeploymentPhaseTypeCreateRequest {
	userId: string;
	name: string;
	description?: string?;
}

declare interface DeploymentPhaseTypeUpdateRequest {
	typeId: string;
	name: string;
	description?: string?;
}

declare interface DeploymentPhaseCreateRequest {
	processId: string;
	numOrder: number;
	description?: string?;
	typeId: string;
}

declare interface DeploymentPhaseUpdateRequest {
	phaseId: string;
	numOrder: number;
	description?: string?;
}

declare interface DocumentTypeCreateRequest {
	name: string;
	description?: string?;
	userId: string;
}

declare interface DocumentTypeUpdateRequest {
	name: string;
	description?: string?;
	typeId: string;
}

declare interface SoftwareDocumentCreateRequest {
	name: string;
	description?: string?;
	documentTypeId: string;
	softwareVersionId: string;
	attachmentIds?: string[]?;
}

declare interface SoftwareDocumentUpdateRequest {
	name: string;
	description?: string?;
	attachmentIds: string[];
	softwareDocumentId: string;
}

declare interface MailTemplateCreateRequest {
	content: string;
	type: MailTemplateType;
	userId: string;
}

declare interface MailTemplateUpdateRequest {
	content: string;
	type: MailTemplateType;
	templateId: string;
	userId: string;
}
