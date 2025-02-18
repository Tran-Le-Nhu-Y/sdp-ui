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
	CUSTOMER_ID = 'customerId',
	DEPLOYMENT_PROCESS_ID = 'processId',
}

export enum RoutePaths {
	OVERVIEW = '/overview',
	CUSTOMER = '/customer',
	CREATE_CUSTOMER = '/customer/create',
	SOFTWARE = '/software',
	CREATE_SOFTWARE = '/software/create',
	MODIFY_SOFTWARE = `/software/:${PathHolders.SOFTWARE_ID}/modify`,
	CREATE_SOFTWARE_VERSION = `/software/:${PathHolders.SOFTWARE_ID}/version/create`,
	DEPLOYMENT_PROCESS = '/deployment',
	CREATE_DEPLOYMENT_PROCESS = '/deployment/create',
}

export enum hideDuration {
	fast = 3000,
	slow = 5000,
}
