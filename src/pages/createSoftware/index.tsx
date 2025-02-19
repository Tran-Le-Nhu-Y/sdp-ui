import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useCreateSoftware } from '../../services';
import { Box } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';

export default function CreateSoftwarePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createSoftwareTrigger] = useCreateSoftware();
	const notifications = useNotifications();

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newSoftware: SoftwareCreateRequest = {
			name: data.name,
			description: data.description,
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		};
		try {
			await createSoftwareTrigger(newSoftware);
			notifications.show(t('createSoftwareSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			navigate(-1);
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
			{/* {createSoftware.isLoading && <LinearProgress />} */}
			<CreateOrModifyForm
				title={t('addSoftware')}
				label={t('softwareName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
