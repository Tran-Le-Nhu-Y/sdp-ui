import { createAxiosInstance } from '../utils';

export const sdpInstance = createAxiosInstance({
	baseURL: `${import.meta.env.VITE_API_GATEWAY}`,
});
export const fileInst = createAxiosInstance({
	baseURL: `${import.meta.env.VITE_FILE_API}`,
});
export const userInst = createAxiosInstance({
	baseURL: `${import.meta.env.VITE_KEYCLOAK_URL}/admin/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
});
// export const notificationInst = createAxiosInstance({});
