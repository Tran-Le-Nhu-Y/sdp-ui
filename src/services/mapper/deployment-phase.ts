function toEntity(response: DeploymentPhaseResponse): DeploymentPhase {
	const phase: DeploymentPhase = {
		id: response.id,
		numOrder: response.numOrder,
		description: response.description,
		type: {
			name: response.type.name,
		},
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
	};
	return phase;
}

export { toEntity };
