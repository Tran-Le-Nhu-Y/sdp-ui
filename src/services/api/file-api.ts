import { sdpInstance } from '../instance';

export async function getMetadata(fileId: string) {
	const response = await sdpInstance.get(`v1/file/${fileId}/metadata`);
	return response.data as FileMetadataResponse;
}
