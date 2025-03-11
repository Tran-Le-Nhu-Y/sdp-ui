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
		plannedStartDate: new Date(response.plannedStartDate).toLocaleDateString(),
		plannedEndDate: new Date(response.plannedEndDate).toLocaleDateString(),
		actualStartDate: response.actualStartDate
			? new Date(response.actualStartDate).toLocaleDateString()
			: null,
		actualEndDate: response.actualEndDate
			? new Date(response.actualEndDate).toLocaleDateString()
			: null,
		isDone: response.isDone,
		lastUpdatedByUserId: response.userLastUpdatedId,
	};
	return phase;
}

export { toEntity };
