import {
	keycloakApi,
	useGetByIdQuery as useGetUser,
	useGetAllUsersByRoleQuery as useGetAllUsersByRole,
} from './keycloak-query';
export { keycloakApi, useGetUser, useGetAllUsersByRole };

import {
	subscribeNotification,
	unsubscribeNotification,
	sendNotification,
	NotificationDestination,
} from './broker';
export { subscribeNotification, unsubscribeNotification, sendNotification };
export type { NotificationDestination };

import {
	notificationApi,
	useGetNewestNotificationMutation as useGetNewestNotification,
	useCountHistoriesQuery as useCountNotificationHistories,
	useGetAllHistoriesQuery as useGetAllNotificationHistories,
	usePutHistoryMutation as useUpdateNotificationHistory,
	useDeleteHistoryMutation as useDeleteNotificationHistory,
	useDeleteAllHistoriesMutation as useDeleteAllNotificationHistories,
} from './notification';
export {
	notificationApi,
	useGetNewestNotification,
	useCountNotificationHistories,
	useGetAllNotificationHistories,
	useUpdateNotificationHistory,
	useDeleteNotificationHistory,
	useDeleteAllNotificationHistories,
};

import {
	fileApi,
	useGetMetadataQuery as useGetFileMetadata,
	usePostMutation as useCreateFile,
	useDeleteMutation as useDeleteFile,
} from './file';
import { getDownloadPath, createDownloadUrl } from './api/file-api';
export {
	fileApi,
	getDownloadPath,
	createDownloadUrl,
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
	useGetMemberIdsQuery as useGetDeploymentProcessMemberIds,
	useGetProcessQuery as useGetDeploymentProcess,
	useGetAllModulesQuery as useGetAllModulesInProcess,
	usePostProcessMutation as useCreateDeploymentProcess,
	usePutProcessMutation as useUpdateDeploymentProcess,
	usePutMemberMutation as useUpdateDeploymentProcessMember,
	useDeleteProcessMutation as useDeleteDeploymentProcess,
} from './deployment-process';
export {
	deploymentProcessApi,
	useGetAllDeploymentProcesses,
	useGetDeploymentProcess,
	useGetDeploymentProcessMemberIds,
	useGetAllModulesInProcess,
	useCreateDeploymentProcess,
	useUpdateDeploymentProcess,
	useUpdateDeploymentProcessMember,
	useDeleteDeploymentProcess,
};

import {
	deploymentPhaseApi,
	useGetAllPhasesByProcessIdQuery as useGetAllDeploymentPhasesByProcessId,
	useGetPhaseByIdQuery as useGetPhaseById,
	useGetMemberIdsQuery as useGetDeploymentPhaseMemberIds,
	usePostPhaseMutation as useCreateDeploymentPhase,
	useGetAllAttachmentsQuery as useGetAllPhaseAttachments,
	usePutPhaseMutation as useUpdateDeploymentPhase,
	usePutMemberMutation as useUpdateDeploymentPhaseMember,
	useDeletePhaseMutation as useDeleteDeploymentPhase,
	usePutAttachmentMutation as useUpdateDeploymentPhaseAttachment,
	usePutActualMutation as useUpdateDeploymentPhaseActualDates,
} from './deployment-phase';
export {
	deploymentPhaseApi,
	useGetAllDeploymentPhasesByProcessId,
	useGetPhaseById,
	useGetDeploymentPhaseMemberIds,
	useCreateDeploymentPhase,
	useUpdateDeploymentPhase,
	useUpdateDeploymentPhaseMember,
	useDeleteDeploymentPhase,
	useGetAllPhaseAttachments,
	useUpdateDeploymentPhaseAttachment,
	useUpdateDeploymentPhaseActualDates,
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
	useGetAllAttachmentsQuery as useGetAllSoftDocAttachments,
	usePutAttachmentMutation as useUpdateSoftDocAttachment,
} from './software-document';

export {
	softwareDocumentApi,
	useGetAllSoftwareDocumentByVersionId,
	useGetSoftwareDocumentById,
	useCreateSoftwareDocument,
	useUpdateSoftwareDocument,
	useDeleteSoftwareDocument,
	useGetAllSoftDocAttachments,
	useUpdateSoftDocAttachment,
};

import {
	moduleDocumentApi,
	useGetAllModuleDocumentsByVersionIdQuery as useGetAllModuleDocumentByVersionId,
	useGetModuleDocumentByIdQuery as useGetModuleDocumentById,
	usePostModuleDocumentMutation as useCreateModuleDocument,
	usePutModuleDocumentMutation as useUpdateModuleDocument,
	useDeleteModuleDocumentMutation as useDeleteModuleDocument,
	useGetAllAttachmentsQuery as useGetAllModuleAttachments,
	usePutAttachmentMutation as useUpdateModDocAttachment,
} from './module-document';
export {
	moduleDocumentApi,
	useGetAllModuleDocumentByVersionId,
	useGetModuleDocumentById,
	useCreateModuleDocument,
	useUpdateModuleDocument,
	useDeleteModuleDocument,
	useGetAllModuleAttachments,
	useUpdateModDocAttachment,
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

import {
	softwareLicenseApi,
	useGetAllExpiredQuery as useGetAllExpiredLicenses,
	useGetAllByProcessIdQuery as useGetAllLicensesByProcessId,
	useGetByIdQuery as useGetSoftwareLicenseById,
	useGetDetailByIdQuery as useGetSoftwareLicenseDetailById,
	usePostMutation as useCreateSoftwareLicense,
	usePutMutation as useUpdateSoftwareLicense,
	useDeleteMutation as useDeleteSoftwareLicense,
} from './software-license';
export {
	softwareLicenseApi,
	useGetAllExpiredLicenses,
	useGetAllLicensesByProcessId,
	useGetSoftwareLicenseById,
	useGetSoftwareLicenseDetailById,
	useCreateSoftwareLicense,
	useUpdateSoftwareLicense,
	useDeleteSoftwareLicense,
};
