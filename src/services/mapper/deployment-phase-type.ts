function toEntity(response: DeploymentPhaseTypeResponse): DeploymentPhaseType {
	const type: DeploymentPhaseType = {
		id: response.id,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
	};
	return type;
}

export { toEntity };
