function toEntity(response: ModuleDocumentResponse): ModuleDocument {
	const document: ModuleDocument = {
		id: response.id,
		typeName: response.type.name,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: '',
	};
	return document;
}

export { toEntity };
