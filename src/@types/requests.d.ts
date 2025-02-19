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

declare interface DocumentTypeCreatingRequest {
	name: string;
	description?: string?;
	userId: string;
}

declare interface DocumentTypeUpdatingRequest {
	name: string;
	description?: string?;
	typeId: string;
}

declare interface SoftwareDocumentCreatingRequest {
	name: string;
	description?: string?;
	documentTypeId: string;
	softwareVersionId: string;
	attachmentIds?: string[]?;
}

declare interface SoftwareDocumentUpdatingRequest {
	name: string;
	description?: string?;
	attachmentIds: string[];
	softwareDocumentId: string;
}
