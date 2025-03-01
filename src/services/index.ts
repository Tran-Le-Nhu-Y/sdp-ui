import {
	fileApi,
	useGetQuery as useGetFile,
	useGetMetadataQuery as useGetFileMetadata,
	usePostMutation as useCreateFile,
	useDeleteMutation as useDeleteFile,
} from './file';
export {
	fileApi,
	useGetFile,
	useGetFileMetadata,
	useCreateFile,
	useDeleteFile,
};

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
	useGetAllVersionsByUserIdQuery as useGetAllVersionsByUserId,
	useGetSoftwareVersionByIdQuery as useGetSoftwareVersionById,
	usePostSoftwareVersionMutation as useCreateSoftwareVersion,
	usePutSoftwareVersionMutation as useUpdateSoftwareVersion,
	useDeleteSoftwareVersionMutation as useDeleteSoftwareVersion,
} from './software-version';
export {
	softwareVersionApi,
	useGetAllVersionsByUserId,
	useGetAllVersionsBySoftwareId,
	useGetSoftwareVersionById,
	useCreateSoftwareVersion,
	useUpdateSoftwareVersion,
	useDeleteSoftwareVersion,
};

import {
	moduleApi,
	useGetAllModuleBySoftwareVersionIdQuery as useGetAllModuleBySoftwareVersionId,
	useGetModuleByIdQuery as useGetModuleById,
	usePostModuleMutation as useCreateModule,
	usePutModuleMutation as useUpdateModule,
	useDeleteModuleMutation as useDeleteModule,
} from './module';
export {
	moduleApi,
	useGetAllModuleBySoftwareVersionId,
	useGetModuleById,
	useCreateModule,
	useUpdateModule,
	useDeleteModule,
};

import {
	moduleVersionApi,
	useGetAllModuleVersionsByModuleIdQuery as useGetAllModuleVersionsByModuleId,
	useGetAllVersionsBySoftwareVersionIdQuery as useGetAllVersionsBySoftwareVersionId,
	useGetModuleVersionByIdQuery as useGetModuleVersionById,
	usePostModuleVersionMutation as useCreateModuleVersion,
	usePutModuleVersionMutation as useUpdateModuleVersion,
	useDeleteModuleVersionMutation as useDeleteModuleVersion,
} from './module-version';
export {
	moduleVersionApi,
	useGetAllModuleVersionsByModuleId,
	useGetAllVersionsBySoftwareVersionId,
	useGetModuleVersionById,
	useCreateModuleVersion,
	useUpdateModuleVersion,
	useDeleteModuleVersion,
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
	useGetAllSoftwareDocumentsByVersionIdQuery as useGetAllSoftwareDocumentByVersionId,
	useGetSoftwareDocumentByIdQuery as useGetSoftwareDocumentById,
	usePostSoftwareDocumentMutation as useCreateSoftwareDocument,
	usePutSoftwareDocumentMutation as useUpdateSoftwareDocument,
	useDeleteSoftwareDocumentMutation as useDeleteSoftwareDocument,
} from './software-document';

export {
	softwareDocumentApi,
	useGetAllSoftwareDocumentByVersionId,
	useGetSoftwareDocumentById,
	useCreateSoftwareDocument,
	useUpdateSoftwareDocument,
	useDeleteSoftwareDocument,
};
import {
	moduleDocumentApi,
	useGetAllModuleDocumentsByVersionIdQuery as useGetAllModuleDocumentByVersionId,
	useGetModuleDocumentByIdQuery as useGetModuleDocumentById,
	usePostModuleDocumentMutation as useCreateModuleDocument,
	usePutModuleDocumentMutation as useUpdateModuleDocument,
	useDeleteModuleDocumentMutation as useDeleteModuleDocument,
} from './module-document';

export {
	moduleDocumentApi,
	useGetAllModuleDocumentByVersionId,
	useGetModuleDocumentById,
	useCreateModuleDocument,
	useUpdateModuleDocument,
	useDeleteModuleDocument,
};

import {
	mailTemplateApi,
	useGetMailTemplateQuery as useGetMailTemplateByUserId,
	usePostMailTemplateMutation as useCreateMailTemplate,
	usePutMailTemplateMutation as useUpdateMailTemplate,
} from './mail-template';
export {
	mailTemplateApi,
	useGetMailTemplateByUserId,
	useCreateMailTemplate,
	useUpdateMailTemplate,
};
