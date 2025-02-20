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

declare interface GetAllModuleQuery {
	softwareVersionId: string;
	moduleName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllModuleVersionQuery {
	moduleId: string;
	moduleVersionName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllSoftwareDocumentQuery {
	softwareVersionId: string;
	documentTypeName?: string?;
	softwareDocumentName?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllDocumentTypeQuery {
	userId: string;
	documentTypeName?: string?;
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

declare interface GetAllCustomerQuery {
	email?: string?;
	name?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}

declare interface GetAllDeploymentPhaseQuery {
	processId: number;
}

declare interface GetAllDeploymentPhaseTypeQuery {
	userId: string;
	name?: string?;
	pageNumber?: number?;
	pageSize?: number?;
}
