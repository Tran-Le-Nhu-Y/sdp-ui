declare interface GetAllSoftwareQuery {
	userId: string;
	softwareName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllSoftwareVersionQuery {
	softwareId: string;
	versionName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllSoftwareDocumentQuery {
	softwareVersionId: string;
	documentTypeName?: string?;
	softwareDocumentName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllDocumentTypeQuery {
	userId: string;
	documentTypeName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}
