import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useCreateDeploymentProcess } from '../../services';
import { HideDuration, RoutePaths } from '../../utils';
import { useNotifications, useSession } from '@toolpad/core';
import SaveIcon from '@mui/icons-material/Save';
import SelectCustomerSection from './SelectCustomerSection';
import SelectSoftwareAndVersionSection from './SelectSoftwareAndVersionSection';
import SelectModuleAndVersionSection from './SelectModuleAndVersionSection';

export default function CreateDeploymentProcessPage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const notifications = useNotifications();
	const navigate = useNavigate();
	const [expandControl, setExpandControl] = useState({
		customer: false,
		software: false,
		module: false,
	});
	const [processCreating, setProcessCreating] = useState<
		Partial<{
			customerId: string;
			software: { id: string; versionId: string };
			modules: Array<{ id: string; versionId: string }>;
		}>
	>();

	const [createProcessTrigger, { isLoading: isCreating }] =
		useCreateDeploymentProcess();

	const handleSubmit = async () => {
		function validate() {
			if (processCreating?.customerId === undefined) {
				notifications.show(t('customerNotSelected'), {
					autoHideDuration: HideDuration.fast,
					severity: 'info',
				});
				return false;
			}

			if (processCreating?.modules === undefined) {
				notifications.show(t('moduleNotSelected'), {
					autoHideDuration: HideDuration.fast,
					severity: 'info',
				});
				return false;
			}

			return true;
		}
		if (!validate()) return;

		try {
			const moduleVersionIds = processCreating?.modules?.map(
				(m) => m.versionId
			);
			const customerId = processCreating?.customerId;
			const softwareVersionId = processCreating?.software?.versionId;

			await createProcessTrigger({
				userId: userId,
				customerId: customerId!,
				softwareVersionId: softwareVersionId!,
				moduleVersionIds: moduleVersionIds!,
			}).unwrap();
			notifications.show(t('createDeployProcessSuccess'), {
				autoHideDuration: HideDuration.fast,
				severity: 'success',
			});
			navigate(RoutePaths.DEPLOYMENT_PROCESS);
		} catch (error) {
			console.error(error);
			notifications.show(t('createDeployProcessError'), {
				autoHideDuration: HideDuration.fast,
				severity: 'error',
			});
		}
	};
	const handleCancel = () => {
		navigate(RoutePaths.DEPLOYMENT_PROCESS);
	};

	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDeploymentProcess')}
			</Typography>

			<Stack gap={1}>
				<SelectCustomerSection
					open={expandControl.customer}
					onOpenChange={(isOpen) =>
						setExpandControl((pre) => ({ ...pre, customer: isOpen }))
					}
					onCustomerChange={(customerId) => {
						setProcessCreating((pre) => ({
							...pre,
							customerId,
						}));
					}}
				/>

				<SelectSoftwareAndVersionSection
					userId={userId}
					open={expandControl.software}
					onOpenChange={(isOpen) =>
						setExpandControl((pre) => ({ ...pre, software: isOpen }))
					}
					onModelChange={(model) => {
						setProcessCreating((pre) => ({
							...pre,
							software: model && {
								id: model.softwareId,
								versionId: model.versionId,
							},
							modules: undefined,
						}));
					}}
				/>

				<SelectModuleAndVersionSection
					softwareVersionId={processCreating?.software?.versionId}
					open={expandControl.module}
					onOpenChange={(isOpen) =>
						setExpandControl((pre) => ({ ...pre, module: isOpen }))
					}
					onModelChange={(modules) => {
						setProcessCreating((pre) => ({
							...pre,
							modules: modules.map(({ moduleId, versionId }) => ({
								id: moduleId,
								versionId: versionId,
							})),
						}));
					}}
				/>
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button
					loading={isCreating}
					loadingPosition="start"
					startIcon={<SaveIcon />}
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					{t('submit')}
				</Button>
				<Button variant="outlined" color="secondary" onClick={handleCancel}>
					{t('cancel')}
				</Button>
			</Box>
		</Stack>
	);
}
