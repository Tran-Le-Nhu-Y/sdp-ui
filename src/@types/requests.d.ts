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
