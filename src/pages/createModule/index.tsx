import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders } from '../../utils';
import { useCreateModule } from '../../services';

export default function CreateModulePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createModuleTrigger] = useCreateModule();
	const notifications = useNotifications();
	const softwareVersionId = useParams()[PathHolders.SOFTWARE_VERSION_ID];

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		const newModule: ModuleCreateRequest = {
			name: data.name,
			description: data.description,
			softwareVersionId: softwareVersionId!,
		};
		if (!data.name.trim()) {
			notifications.show(t('moduleNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await createModuleTrigger(newModule);
			navigate(-1);
			notifications.show(t('createModuleSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createModuleError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			<CreateOrModifyForm
				title={t('addModule')}
				label={t('moduleName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
