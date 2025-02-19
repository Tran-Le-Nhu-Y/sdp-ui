import {
	softwareApi,
	useGetAllSoftwareByUserIdQuery as useGetAllSoftwareByUserId,
	useDeleteSoftwareMutation as useDeleteSoftware,
	useGetSoftwareByIdQuery as useGetSoftwareById,
	usePostSoftwareMutation as useCreateSoftware,
	usePutSoftwareMutation as useUpdateSoftware,
} from './software';
export {
	softwareApi,
	useGetAllSoftwareByUserId,
	useDeleteSoftware,
	useGetSoftwareById,
	useCreateSoftware,
	useUpdateSoftware,
};

import {
	softwareVersionApi,
	useGetAllVersionsBySoftwareIdQuery as useGetAllVersionsBySoftwareId,
	useGetSoftwareVersionByIdQuery as useGetSoftwareVersionById,
	usePostSoftwareVersionMutation as useCreateSoftwareVersion,
	usePutSoftwareVersionMutation as useUpdateSoftwareVersion,
	useDeleteSoftwareVersionMutation as useDeleteSoftwareVersion,
} from './software-version';
export {
	softwareVersionApi,
	useGetAllVersionsBySoftwareId,
	useGetSoftwareVersionById,
	useCreateSoftwareVersion,
	useUpdateSoftwareVersion,
	useDeleteSoftwareVersion,
};

import {
	documentTypeApi,
	useGetAllDocumentTypesByUserIdQuery as useGetAllDocumentTypesByUserId,
	useGetDocumentTypeByIdQuery as useGetDocumentTypeById,
	usePostDocumentTypeMutation as useCreateDocumentType,
	usePutDocumentTypeMutation as useUpdateDocumentType,
	useDeleteDocumentTypeMutation as useDeleteDocumentType,
} from './document-type';
export {
	documentTypeApi,
	useGetAllDocumentTypesByUserId,
	useGetDocumentTypeById,
	useCreateDocumentType,
	useUpdateDocumentType,
	useDeleteDocumentType,
};

import {
	softwareDocumentApi,
	useGetAllSoftwareDocumentsByUserIdQuery as useGetAllSoftwareDocumentByUserId,
	useGetSoftwareDocumentByIdQuery as useGetSoftwareDocumentById,
	usePostSoftwareDocumentMutation as useCreateSoftwareDocument,
	usePutSoftwareDocumentMutation as useUpdateSoftwareDocument,
	useDeleteSoftwareDocumentMutation as useDeleteSoftwareDocument,
} from './software-document';

export {
	softwareDocumentApi,
	useGetAllSoftwareDocumentByUserId,
	useGetSoftwareDocumentById,
	useCreateSoftwareDocument,
	useUpdateSoftwareDocument,
	useDeleteSoftwareDocument,
};
