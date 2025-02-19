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
