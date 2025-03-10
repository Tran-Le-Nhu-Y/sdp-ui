import {
	BaseQueryFn,
	fetchBaseQuery,
	FetchBaseQueryArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import keycloak from '../services/keycloak';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	CreateAxiosDefaults,
} from 'axios';

export enum TextLength {
	Short = 6,
	Medium = 100,
	Long = 150,
	VeryLong = 255,
	ExtremeLong = 60000,
}

export enum PathHolders {
	SOFTWARE_ID = 'softwareId',
	SOFTWARE_VERSION_ID = 'versionId',
	MODULE_ID = 'moduleId',
	MODULE_VERSION_ID = 'moduleVersionId',
	SOFTWARE_DOCUMENT_ID = 'softwareDocumentId',
	MODULE_DOCUMENT_ID = 'moduleDocumentId',
	CUSTOMER_ID = 'customerId',
	DEPLOYMENT_PROCESS_ID = 'processId',
	DEPLOYMENT_PHASE_TYPE_ID = 'phaseTypeId',
	TEMPLATE_SOFTWARE_EXPIRATION_ID = 'softwareExpirationId',
	TEMPLATE_COMPLETE_DEPLOYMENT_ID = 'completeDeploymentId',
}

export enum RoutePaths {
	NOTIFICATION = '/notification',
	OVERVIEW = '/overview',

	CUSTOMER = '/customer',
	CREATE_CUSTOMER = '/customer/create',

	SOFTWARE = '/software',
	CREATE_SOFTWARE = '/software/create',
	MODIFY_SOFTWARE = `/software/:${PathHolders.SOFTWARE_ID}/modify`,

	SOFTWARE_VERSION = `/software/:${PathHolders.SOFTWARE_ID}/version/:${PathHolders.SOFTWARE_VERSION_ID}`,
	CREATE_SOFTWARE_VERSION = `/software/:${PathHolders.SOFTWARE_ID}/version/create`,
	MODIFY_SOFTWARE_VERSION = `/software/version/:${PathHolders.SOFTWARE_VERSION_ID}/modify`,

	CREATE_MODULE = `/software/version/:${PathHolders.SOFTWARE_VERSION_ID}/module/create`,
	MODIFY_MODULE = `/software/version/module/:${PathHolders.MODULE_ID}/modify`,

	MODULE_VERSION = `/software/version/module/:${PathHolders.MODULE_ID}/version/:${PathHolders.MODULE_VERSION_ID}`,
	CREATE_MODULE_VERSION = `/software/version/module/:${PathHolders.MODULE_ID}/version/create`,
	MODIFY_MODULE_VERSION = `/software/version/module/:${PathHolders.MODULE_VERSION_ID}/version/modify`,

	DOCUMENT_TYPE = `/document-type`,

	CREATE_SOFTWARE_DOCUMENT = `/software/version/:${PathHolders.SOFTWARE_VERSION_ID}/document/create`,
	SOFTWARE_DOCUMENT = `/software/version/document/:${PathHolders.SOFTWARE_DOCUMENT_ID}`,
	MODIFY_SOFTWARE_DOCUMENT = `/software/version/document/:${PathHolders.SOFTWARE_DOCUMENT_ID}/modify`,

	CREATE_MODULE_DOCUMENT = `/software/module/version/:${PathHolders.MODULE_VERSION_ID}/document/create`,
	MODULE_DOCUMENT = `/software/module/document/:${PathHolders.MODULE_DOCUMENT_ID}`,
	MODIFY_MODULE_DOCUMENT = `/software/module/document/:${PathHolders.MODULE_DOCUMENT_ID}/modify`,

	DEPLOYMENT_PROCESS = '/deployment/process',
	CREATE_DEPLOYMENT_PROCESS = '/deployment/process/create',
	DEPLOYMENT_PROCESS_DETAIL = `/deployment/process/:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
	SETUP_DEPLOYMENT_PROCESS = `/deployment/process/:${PathHolders.DEPLOYMENT_PROCESS_ID}/setup`,

	DEPLOYMENT_PHASE_TYPE = '/deployment/phase-type',

	TEMPLATE_SOFTWARE_EXPIRATION = '/mail-template/software-expiration',
	TEMPLATE_COMPLETE_DEPLOYMENT = '/mail-template/complete-deployment',
}

export enum HideDuration {
	fast = 3000,
	slow = 5000,
}

export const axiosBaseQuery =
	(
		instance: AxiosInstance
	): BaseQueryFn<
		{
			url: string;
			method?: AxiosRequestConfig['method'];
			body?: AxiosRequestConfig['data'];
			params?: AxiosRequestConfig['params'];
			headers?: AxiosRequestConfig['headers'];
		},
		unknown,
		FetchBaseQueryError
	> =>
	async ({ url, method, body, params, headers }) => {
		try {
			const result = await instance({
				url,
				method,
				data: body,
				params,
				headers,
			});
			return { data: result.data };
		} catch (axiosError) {
			const err = axiosError as AxiosError;
			return {
				error: {
					status: err.response!.status!,
					data: err.response?.data || err.message,
				},
			};
		}
	};

export function fetchAuthQuery(config?: FetchBaseQueryArgs) {
	const token = keycloak.token;
	if (!token) keycloak.logout();
	return fetchBaseQuery({
		...config,
		prepareHeaders(headers, api) {
			headers.set('Authorization', `Bearer ${token}`);
			if (config?.prepareHeaders) config.prepareHeaders(headers, api);
			return headers;
		},
	});
}

export function createAxiosInstance(config?: CreateAxiosDefaults) {
	const token = keycloak.token;
	if (!token) keycloak.logout();
	return axios.create({
		...config,
		headers: {
			...config?.headers,
			Authorization: `Bearer ${token}`,
		},
	});
}

export const isValidLength = (text: string, length: TextLength) =>
	text.length <= length;

export function getFileSize(bytes: number) {
	if (bytes < 1e3) return `${bytes} bytes`;
	else if (bytes >= 1e3 && bytes < 1e6) return `${(bytes / 1e3).toFixed(1)} KB`;
	else return `${(bytes / 1e6).toFixed(1)} MB`;
}

export function getDeploymentProcessStatusTransKey(
	status: DeploymentProcessStatus
) {
	const record: Record<
		DeploymentProcessStatus,
		'init' | 'pending' | 'inProgress' | 'done'
	> = {
		INIT: 'init',
		PENDING: 'pending',
		IN_PROGRESS: 'inProgress',
		DONE: 'done',
	};
	return record[status];
}

const RESOURCE_CLIENT = import.meta.env.VITE_KEYCLOAK_RESOURCE_CLIENT;
export function checkRoles({
	checkAll = true,
	requiredRoles,
}: {
	checkAll?: boolean;
	requiredRoles?: ResourceRoles[];
}) {
	if (!requiredRoles) return true;

	if (checkAll)
		return requiredRoles.every((role) =>
			keycloak.hasResourceRole(role, RESOURCE_CLIENT)
		);
	return requiredRoles.some((role) =>
		keycloak.hasResourceRole(role, RESOURCE_CLIENT)
	);
}
