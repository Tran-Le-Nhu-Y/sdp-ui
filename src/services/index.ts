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
