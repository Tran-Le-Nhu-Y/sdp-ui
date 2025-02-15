import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useCreateSoftware } from '../../services';
import { Box, LinearProgress } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { useEffect } from 'react';
import { hideDuration } from '../../utils';

export default function CreateSoftwarePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createSoftwareTrigger, createSoftware] = useCreateSoftware();
	const notifications = useNotifications();

	useEffect(() => {
		if (createSoftware.isError)
			notifications.show(t('createSoftwareError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (createSoftware.isSuccess) {
			navigate(-1); // back to previous page
			// notifications.show(t('createSoftwareSuccess'), {
			// 	severity: 'success',
			// 	autoHideDuration: hideDuration.fast,
			// });
		}
	}, [
		createSoftware.isError,
		createSoftware.isSuccess,
		navigate,
		notifications,
		t,
	]);
	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newSoftware: SoftwareCreateRequest = {
			name: data.name,
			description: data.description,
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		};
		await createSoftwareTrigger(newSoftware);
	};

	return (
		<Box>
			{createSoftware.isLoading && <LinearProgress />}
			<CreateOrModifyForm
				title={t('addSoftware')}
				label={t('softwareName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
