import { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import keycloak from '../services/keycloak';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	CreateAxiosDefaults,
} from 'axios';
import dayjs, { Dayjs } from 'dayjs';

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
	DEPLOYMENT_PHASE_ID = 'phaseId',
	DEPLOYMENT_PHASE_TYPE_ID = 'phaseTypeId',
	TEMPLATE_SOFTWARE_EXPIRATION_ID = 'softwareExpirationId',
	TEMPLATE_COMPLETE_DEPLOYMENT_ID = 'completeDeploymentId',
}

export enum RoutePaths {
	NOTIFICATION = '/notification',
	OVERVIEW = '/overview',
	CUSTOMER = '/customer',
	DOCUMENT_TYPE = `/document-type`,

	SOFTWARE = '/software',
	CREATE_SOFTWARE = `${SOFTWARE}/create`,
	MODIFY_SOFTWARE = `${SOFTWARE}/:${PathHolders.SOFTWARE_ID}/modify`,

	SOFTWARE_VERSION = `${SOFTWARE}/:${PathHolders.SOFTWARE_ID}/version/:${PathHolders.SOFTWARE_VERSION_ID}`,
	CREATE_SOFTWARE_VERSION = `${SOFTWARE}/:${PathHolders.SOFTWARE_ID}/version/create`,
	MODIFY_SOFTWARE_VERSION = `${SOFTWARE}/version/:${PathHolders.SOFTWARE_VERSION_ID}/modify`,

	CREATE_MODULE = `${SOFTWARE}/version/:${PathHolders.SOFTWARE_VERSION_ID}/module/create`,
	MODIFY_MODULE = `${SOFTWARE}/version/module/:${PathHolders.MODULE_ID}/modify`,

	MODULE_VERSION = `${SOFTWARE}/version/module/:${PathHolders.MODULE_ID}/version/:${PathHolders.MODULE_VERSION_ID}`,
	CREATE_MODULE_VERSION = `${SOFTWARE}/version/module/:${PathHolders.MODULE_ID}/version/create`,
	MODIFY_MODULE_VERSION = `${SOFTWARE}/version/module/:${PathHolders.MODULE_VERSION_ID}/version/modify`,

	CREATE_SOFTWARE_DOCUMENT = `${SOFTWARE}/version/:${PathHolders.SOFTWARE_VERSION_ID}/document/create`,
	SOFTWARE_DOCUMENT = `${SOFTWARE}/version/document/:${PathHolders.SOFTWARE_DOCUMENT_ID}`,
	MODIFY_SOFTWARE_DOCUMENT = `${SOFTWARE}/version/document/:${PathHolders.SOFTWARE_DOCUMENT_ID}/modify`,

	CREATE_MODULE_DOCUMENT = `${SOFTWARE}/module/version/:${PathHolders.MODULE_VERSION_ID}/document/create`,
	MODULE_DOCUMENT = `${SOFTWARE}/module/document/:${PathHolders.MODULE_DOCUMENT_ID}`,
	MODIFY_MODULE_DOCUMENT = `${MODULE_DOCUMENT}/modify`,

	DEPLOYMENT_PROCESS = '/deployment/process',
	CREATE_DEPLOYMENT_PROCESS = `${DEPLOYMENT_PROCESS}/create`,
	DEPLOYMENT_PROCESS_DETAIL = `${DEPLOYMENT_PROCESS}/:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
	SETUP_DEPLOYMENT_PROCESS = `${DEPLOYMENT_PROCESS}/:${PathHolders.DEPLOYMENT_PROCESS_ID}/setup`,

	SETUP_DEPLOYMENT_PHASE = `${SETUP_DEPLOYMENT_PROCESS}/phase/:${PathHolders.DEPLOYMENT_PHASE_ID}`,
	DEPLOYMENT_PHASE_TYPE = '/deployment/phase-type',

	TEMPLATE_SOFTWARE_EXPIRATION = '/mail-template/software-expiration',
	TEMPLATE_COMPLETE_DEPLOYMENT = '/mail-template/complete-deployment',
}

export enum HideDuration {
	fast = 3000,
	slow = 5000,
}

export const axiosQueryHandler = async <T>(func: () => Promise<T>) => {
	try {
		const result = await func();
		return { data: result };
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

export function createAxiosInstance(config?: CreateAxiosDefaults) {
	const instance = axios.create(config);

	instance.interceptors.request.use(
		async function (config) {
			// Do something before request is sent
			if (keycloak.isTokenExpired(15)) {
				try {
					await keycloak.updateToken(15);
					config.headers.Authorization = `Bearer ${keycloak.token}`;
				} catch (error) {
					console.error(error);
					alert('Failed to refresh the token, or the session has expired');
					keycloak.logout();
				}
			} else {
				const token = keycloak.token;
				if (!token) keycloak.logout();
				config.headers.Authorization = `Bearer ${keycloak.token}`;
			}
			return config;
		},
		function (error) {
			// Do something with request error
			return Promise.reject(error);
		}
	);

	return instance;
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

export const convertToAPIDateFormat = (date: Dayjs) => {
	return date.format('YYYY-MM-DD');
};

export const parseToDayjs = (date: string) => {
	return dayjs(date, 'YYYY-MM-DD');
};
