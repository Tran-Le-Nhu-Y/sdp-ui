function toEntity(response: FileMetadataResponse): FileMetadata {
	return {
		id: response.id,
		name: response.name,
		size: response.size,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		mimeType: response.mimeType,
	};
}

export { toEntity };
