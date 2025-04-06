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
		lastUpdatedByUserId: response.userLastUpdatedId ?? '',
	};
	return phase;
}

function toHistoryEntity(
	response: DeploymentPhaseUpdateHistoryResponse,
	userPerformed: UserMetadata,
): DeploymentPhaseUpdateHistory {
	return {
		numOrder: response.id.numOrder,
		userPerformed: userPerformed,
		phase: {
			id: response.id.phaseId,
			type: {
				name: response.phaseType.name,
			},
		},
		description: response.description,
		isDone: response.isDone,
		updatedAt: response.updatedAt,
	};
}

export { toEntity, toHistoryEntity };
