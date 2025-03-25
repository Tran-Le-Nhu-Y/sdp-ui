import { sdpInstance } from '../instance';

const EXTENSION_URL = 'v1/file';

export async function getMetadata(fileId: string) {
	const response = await sdpInstance.get(`${EXTENSION_URL}/${fileId}/metadata`);
	return response.data as FileMetadataResponse;
}

export async function getDownloadPath(fileId: string) {
	const response = await sdpInstance.get(`${EXTENSION_URL}/${fileId}`);
	return response.data as string;
}

export function createDownloadUrl(path: string) {
	return `${sdpInstance.getUri().replace('/api', '')}/file/download/${path}`;
}
