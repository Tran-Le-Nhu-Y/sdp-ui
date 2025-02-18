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
	deploymentProcessApi,
	useGetAllProcessesQuery as useGetAllDeploymentProcesses,
	useGetProcessQuery as useGetDeploymentProcess,
	usePostProcessMutation as useCreateDeploymentProcess,
	usePutProcessMutation as useUpdateDeploymentProcess,
	useDeleteProcessMutation as useDeleteDeploymentProcess,
} from './deployment-process';
export {
	deploymentProcessApi,
	useGetAllDeploymentProcesses,
	useGetDeploymentProcess,
	useCreateDeploymentProcess,
	useUpdateDeploymentProcess,
	useDeleteDeploymentProcess,
};

import {
	documentLabelApi,
	useGetAllDocumentLabelsByUserIdQuery as useGetAllDocumentLabelsByUserId,
	usePostDocumentLabelMutation as useCreateDocumentLabel,
	useGetLabelByIdQuery as useGetDocumentLabelById,
	usePutLabelMutation as useUpdateDocumentLabel,
	useDeleteLabelMutation as useDeleteDocumentLabel,
} from './document-label';
export {
	documentLabelApi,
	useGetAllDocumentLabelsByUserId,
	useCreateDocumentLabel,
	useGetDocumentLabelById,
	useUpdateDocumentLabel,
	useDeleteDocumentLabel,
};
