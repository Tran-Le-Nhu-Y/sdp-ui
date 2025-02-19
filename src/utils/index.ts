export enum TextLength {
	Short = 6,
	Medium = 100,
	Long = 150,
	VeryLong = 255,
	ExtremeLong = 60000,
}

export const isValidLength = (text: string, length: TextLength) =>
	text.length <= length;

export enum PathHolders {
	SOFTWARE_ID = 'softwareId',
	SOFTWARE_VERSION_ID = 'versionId',
	SOFTWARE_DOCUMENT_ID = 'documentId',
	CUSTOMER_ID = 'customerId',
	DEPLOYMENT_PROCESS_ID = 'processId',
	DEPLOYMENT_PHASE_TYPE_ID = 'phaseTypeId',
}

export enum RoutePaths {
	OVERVIEW = '/overview',
	LOGOUT = '/logout',

	CUSTOMER = '/customer',
	CREATE_CUSTOMER = '/customer/create',

	SOFTWARE = '/software',
	CREATE_SOFTWARE = '/software/create',
	MODIFY_SOFTWARE = `/software/:${PathHolders.SOFTWARE_ID}/modify`,

	CREATE_SOFTWARE_VERSION = `/software/:${PathHolders.SOFTWARE_ID}/version/create`,
	SOFTWARE_VERSION = `/software/version/:${PathHolders.SOFTWARE_VERSION_ID}`,
	MODIFY_SOFTWARE_VERSION = `/software/version/:${PathHolders.SOFTWARE_VERSION_ID}/modify`,

	DOCUMENT_TYPE = `/document-type`,

	CREATE_SOFTWARE_DOCUMENT = `/software/version/:${PathHolders.SOFTWARE_VERSION_ID}/document/create`,
	SOFTWARE_DOCUMENT = `/software/version/document/:${PathHolders.SOFTWARE_DOCUMENT_ID}`,
	MODIFY_SOFTWARE_DOCUMENT = `/software/version/document/:${PathHolders.SOFTWARE_DOCUMENT_ID}/modify`,

	DEPLOYMENT_PROCESS = '/deployment/process',
	CREATE_DEPLOYMENT_PROCESS = '/deployment/process/create',

	DEPLOYMENT_PHASE_TYPE = '/deployment/phase-type',
	CREATE_DEPLOYMENT_PHASE_TYPE = '/deployment/phase-type/create',
}

export enum HideDuration {
	fast = 3000,
	slow = 5000,
}
