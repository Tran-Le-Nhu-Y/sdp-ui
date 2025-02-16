declare interface File {
	id: string;
	name: string;
	size: number;
	status: string;
}
declare interface DocumentLabel {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string?;
	color: string;
}

declare interface ProductVersionChangelog {
	id: string;
	versionId: string;
	name: string;
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
	description: string?;
	createdAt: string;
	updatedAt: string?;
}

declare interface DeployDocument {
	id: string;
	name: string;
	productId: string;
	moduleId: string;
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

declare interface Instance {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string?;
	status: 'ACTIVE' | 'INACTIVE';
}
