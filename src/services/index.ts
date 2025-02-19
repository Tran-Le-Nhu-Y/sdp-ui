import {
	customerApi,
	useGetAllCustomersQuery as useGetAllCustomers,
	useGetCustomerByIdQuery as useGetCustomerById,
	usePostCustomerMutation as useCreateCustomer,
	usePutCustomerMutation as useUpdateCustomer,
	useDeleteCustomerMutation as useDeleteCustomer,
} from './customer';
export {
	customerApi,
	useGetAllCustomers,
	useGetCustomerById,
	useCreateCustomer,
	useUpdateCustomer,
	useDeleteCustomer,
};

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
	deploymentPhaseApi,
	useGetAllPhasesByProcessIdQuery as useGetAllDeploymentPhasesByProcessId,
	useGetPhaseByIdQuery as useGetPhaseById,
	usePostPhaseMutation as useCreateDeploymentPhase,
	usePutPhaseMutation as useUpdateDeploymentPhase,
	useDeletePhaseMutation as useDeleteDeploymentPhase,
} from './deployment-phase';
export {
	deploymentPhaseApi,
	useGetAllDeploymentPhasesByProcessId,
	useGetPhaseById,
	useCreateDeploymentPhase,
	useUpdateDeploymentPhase,
	useDeleteDeploymentPhase,
};

import {
	deploymentPhaseTypeApi,
	useGetAllPhaseTypesByUserIdQuery as useGetAllDeploymentPhaseTypesByUserId,
	useGetPhaseTypeByIdQuery as useGetDeploymentPhaseTypeById,
	usePostPhaseTypeMutation as useCreateDeploymentPhaseType,
	usePutPhaseTypeMutation as useUpdateDeploymentPhaseType,
	useDeletePhaseTypeMutation as useDeleteDeploymentPhaseType,
} from './deployment-phase-type';
export {
	deploymentPhaseTypeApi,
	useGetAllDeploymentPhaseTypesByUserId,
	useGetDeploymentPhaseTypeById,
	useCreateDeploymentPhaseType,
	useUpdateDeploymentPhaseType,
	useDeleteDeploymentPhaseType,
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
