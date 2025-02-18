function toEntity(response: SoftwareVersionResponse): SoftwareVersion {
	const version: SoftwareVersion = {
		id: response.id,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
	};
	return version;
}

export { toEntity };
