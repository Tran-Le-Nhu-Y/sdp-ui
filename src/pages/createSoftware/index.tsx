import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useCreateSoftware } from '../../services';
import { Box } from '@mui/material';
import { useNotifications, useSession } from '@toolpad/core';
import { HideDuration, RoutePaths } from '../../utils';

export default function CreateSoftwarePage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const navigate = useNavigate();
	const [createSoftwareTrigger, { isLoading: isCreating }] =
		useCreateSoftware();
	const notifications = useNotifications();

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newSoftware: SoftwareCreateRequest = {
			name: data.name,
			description: data.description,
			userId: userId,
		};
		if (!data.name.trim()) {
			notifications.show(t('softwareNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await createSoftwareTrigger(newSoftware);
			notifications.show(t('createSoftwareSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			navigate(RoutePaths.SOFTWARE);
		} catch (error) {
			notifications.show(t('createSoftwareError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			<CreateOrModifyForm
				loading={isCreating}
				title={t('addSoftware')}
				label={t('softwareName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
