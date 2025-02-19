function toEntity(response: DeploymentProcessResponse): DeploymentProcess {
	const process: DeploymentProcess = {
		id: response.id,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
		status: response.status,
		software: {
			name: response.software.name,
			version: response.software.versionName,
		},
		customer: {
			name: response.customer.name,
		},
	};
	return process;
}

export { toEntity };
