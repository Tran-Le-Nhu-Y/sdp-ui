import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders } from '../../utils';
import { LinearProgress } from '@mui/material';
import { CreateOrModifyForm } from '../../components';
import { useGetModuleById, useUpdateModule } from '../../services';

export default function ModifyModulePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const moduleId = useParams()[PathHolders.MODULE_ID];
	const notifications = useNotifications();

	const module = useGetModuleById(moduleId!, { skip: !moduleId });
	useEffect(() => {
		if (module.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, module.isError, t]);

	const [updateModuleTrigger] = useUpdateModule();

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		if (!moduleId) return;
		if (!data.name.trim()) {
			notifications.show(t('moduleNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await updateModuleTrigger({
				moduleId: moduleId,
				name: data.name,
				description: data.description,
			});
			navigate(-1);
			notifications.show(t('updateModuleSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateModuleError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	if (module.isLoading) return <LinearProgress />;
	return (
		<CreateOrModifyForm
			title={t('modifyModule')}
			label={`${t('moduleName')}`}
			showModifyValues={{
				name: module.data?.name,
				description: module.data?.description,
			}}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}
