function toEntity(response: DocumentTypeResponse): SdpDocumentType {
	const type: SdpDocumentType = {
		id: response.id,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: '',
	};
	return type;
}

export { toEntity };
