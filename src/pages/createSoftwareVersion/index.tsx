import { useTranslation } from 'react-i18next';
import { useNotifications } from '@toolpad/core';
import { useNavigate, useParams } from 'react-router-dom';
import { HideDuration, PathHolders } from '../../utils';
import { Box } from '@mui/material';
import { CreateOrModifyForm } from '../../components';
import { useCreateSoftwareVersion } from '../../services';

export default function CreateSoftwareVersionPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createSoftwareVersionTrigger] = useCreateSoftwareVersion();
	const notifications = useNotifications();
	const softwareId = useParams()[PathHolders.SOFTWARE_ID];

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newSoftwareVersion: SoftwareVersionCreateRequest = {
			name: data.name,
			description: data.description,
			softwareId: softwareId || 'no-id',
		};
		if (!data.name.trim()) {
			notifications.show(t('softwareVersionNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await createSoftwareVersionTrigger(newSoftwareVersion);
			notifications.show(t('createSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			navigate(-1);
		} catch (error) {
			notifications.show(t('createSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			<CreateOrModifyForm
				title={t('addSoftwareVersion')}
				label={t('versionName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
