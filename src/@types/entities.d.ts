declare interface File {
	id: string;
	name: string;
	size: number;
	status: string;
}
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
}

declare interface SoftwareDocument {
	id: string;
	typeName: string;
	name: string;
	description: string?;
	createdAt: string;
	updatedAt: string?;
}

declare interface Instance {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string?;
	status: 'ACTIVE' | 'INACTIVE';
}
