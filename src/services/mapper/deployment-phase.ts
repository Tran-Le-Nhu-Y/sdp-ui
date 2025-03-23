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
		plannedStartDate: response.plannedStartDate,
		plannedEndDate: response.plannedEndDate,
		actualStartDate: response.actualStartDate,
		actualEndDate: response.actualEndDate,
		isDone: response.isDone,
		lastUpdatedByUserId: response.userLastUpdatedId,
	};
	return phase;
}

export { toEntity };
