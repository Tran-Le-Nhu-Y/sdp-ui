import { useTranslation } from 'react-i18next';
import { useNotifications } from '@toolpad/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { hideDuration, PathHolders } from '../../utils';
import { Box, LinearProgress } from '@mui/material';
import { CreateOrModifyForm } from '../../components';
import { useCreateSoftwareVersion } from '../../services';

export default function CreateSoftwareVersionPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createSoftwareVersionTrigger, createSoftwareVersion] =
		useCreateSoftwareVersion();
	const notifications = useNotifications();
	const softwareId = useParams()[PathHolders.SOFTWARE_ID];

	useEffect(() => {
		if (createSoftwareVersion.isError)
			notifications.show(t('updateSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (createSoftwareVersion.isSuccess) {
			navigate(-1); // back to previous page
			notifications.show(t('createSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [
		createSoftwareVersion.isError,
		createSoftwareVersion.isSuccess,
		navigate,
		notifications,
		t,
	]);
	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newSoftwareVersion: SoftwareVersionCreateRequest = {
			name: data.name,
			description: data.description,
			softwareId: softwareId || 'no-id',
		};
		await createSoftwareVersionTrigger(newSoftwareVersion);
	};

	return (
		<Box>
			{createSoftwareVersion.isLoading && <LinearProgress />}
			<CreateOrModifyForm
				title={t('addSoftwareVersion')}
				label={t('softwareVersionName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
