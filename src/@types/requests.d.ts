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

declare interface DeploymentProcessCreateRequest {
	userId: string;
	softwareVersionId: string;
	customerId: string;
}

declare interface DeploymentProcessUpdateRequest {
	processId: string;
	status: DeploymentProcessStatus;
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

declare interface DocumentLabelCreatingRequest {
	name: string;
	description?: string?;
	color?: string?;
	userId: string;
}

declare interface DocumentLabelUpdatingRequest {
	name: string;
	description?: string?;
	color: string;
}
