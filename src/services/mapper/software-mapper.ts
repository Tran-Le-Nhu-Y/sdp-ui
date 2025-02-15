function toEntity(response: SoftwareResponse): Software {
	const software: Software = {
		id: response.id,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: '',
	};
	return software;
}

export { toEntity };
