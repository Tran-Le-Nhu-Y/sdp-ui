import { fileInst } from '../instance';

export async function getMetadata(fileId: string) {
	const response = await fileInst.get(`v1/file/${fileId}/metadata`);
	return response.data as FileMetadataResponse;
}
