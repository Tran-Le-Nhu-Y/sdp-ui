declare interface GetAllSoftwareQuery {
	userId: string;
	softwareName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllSoftwareVersionQuery {
	softwareId: string;
	versionName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllDeploymentProcessQuery {
	softwareVersionName?: string?;
	customerName?: string?;
	status?: DeploymentProcessStatus?;
	pageNumber?: number?;
	pageSize?: number?;
}
