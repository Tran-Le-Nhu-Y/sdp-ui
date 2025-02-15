import {
	softwareApi,
	useGetAllSoftwareByUserIdQuery as useGetAllSoftwareByUserId,
	useDeleteSoftwareMutation as useDeleteSoftware,
	useGetSoftwareByIdQuery as useGetSoftwareById,
	usePostSoftwareMutation as useCreateSoftware,
	usePutSoftwareMutation as useUpdateSoftware,
} from './software';
import {
	productVersionApi,
	useGetAllVersionsByProductIdQuery as useGetAllVersionsByProductId,
} from './product-version';
import {
	documentLabelApi,
	useGetAllDocumentLabelsByUserIdQuery as useGetAllDocumentLabelsByUserId,
	usePostDocumentLabelMutation as useCreateDocumentLabel,
	useGetLabelByIdQuery as useGetDocumentLabelById,
	usePutLabelMutation as useUpdateDocumentLabel,
	useDeleteLabelMutation as useDeleteDocumentLabel,
} from './document-label';

export {
	softwareApi,
	useGetAllSoftwareByUserId,
	useDeleteSoftware,
	useGetSoftwareById,
	useCreateSoftware,
	useUpdateSoftware,
};
export { productVersionApi, useGetAllVersionsByProductId };
export {
	documentLabelApi,
	useGetAllDocumentLabelsByUserId,
	useCreateDocumentLabel,
	useGetDocumentLabelById,
	useUpdateDocumentLabel,
	useDeleteDocumentLabel,
};
