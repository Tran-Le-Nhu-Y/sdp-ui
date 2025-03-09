import { createAxiosInstance } from '../utils';

export const softwareInst = createAxiosInstance({
	baseURL: `${import.meta.env.VITE_API_GATEWAY}/software`,
});
export const fileInst = createAxiosInstance({
	baseURL: `${import.meta.env.VITE_FILE_API}/v1/file`,
});
export const userInst = createAxiosInstance({
	baseURL: `${import.meta.env.VITE_KEYCLOAK_URL}/admin/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
});
// export const notificationInst = createAxiosInstance({});
