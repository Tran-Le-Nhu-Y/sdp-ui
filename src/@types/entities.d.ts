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

declare interface Instance {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string?;
	status: 'ACTIVE' | 'INACTIVE';
}
