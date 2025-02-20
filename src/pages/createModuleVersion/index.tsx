import { useTranslation } from 'react-i18next';
import { useNotifications } from '@toolpad/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { HideDuration, PathHolders } from '../../utils';
import { Box, LinearProgress } from '@mui/material';
import { CreateOrModifyForm } from '../../components';
import { useCreateModuleVersion } from '../../services';

export default function CreateModuleVersionPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createModuleVersionTrigger, createModuleVersion] =
		useCreateModuleVersion();
	const notifications = useNotifications();

	const moduleId = useParams()[PathHolders.MODULE_ID];
	useEffect(() => {
		if (createModuleVersion.isError)
			notifications.show(t('createModuleVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (createModuleVersion.isSuccess) {
			navigate(-1); // back to previous page
			notifications.show(t('createModuleVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		}
	}, [
		createModuleVersion.isError,
		createModuleVersion.isSuccess,
		navigate,
		notifications,
		t,
	]);
	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newModuleVersion: ModuleVersionCreateRequest = {
			name: data.name,
			description: data.description,
			moduleId: moduleId || 'no-id',
		};
		if (!data.name.trim()) {
			notifications.show(t('moduleVersionNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await createModuleVersionTrigger(newModuleVersion);
			navigate(-1);
			notifications.show(t('createModuleVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createModuleVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			{createModuleVersion.isLoading && <LinearProgress />}
			<CreateOrModifyForm
				title={t('addModuleVersion')}
				label={t('versionName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
