import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { LinearProgress } from '@mui/material';
import { HideDuration, PathHolders } from '../../utils';
import {
	useGetModuleVersionById,
	useUpdateModuleVersion,
} from '../../services';

export default function ModifyModuleVersionPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();
	const versionId = useParams()[PathHolders.MODULE_VERSION_ID];

	const moduleVersion = useGetModuleVersionById(versionId!, {
		skip: !versionId,
	});
	useEffect(() => {
		if (moduleVersion.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, moduleVersion.isError, t]);

	const [updateModuleVersionTrigger] = useUpdateModuleVersion();

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		if (!versionId) return;

		if (!data.name.trim()) {
			notifications.show(t('moduleVersionNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await updateModuleVersionTrigger({
				moduleVersionId: versionId,
				name: data.name,
				description: data.description,
			});
			navigate(-1);
			notifications.show(t('updateModuleVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateModuleVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	if (moduleVersion.isLoading) return <LinearProgress />;
	return (
		<CreateOrModifyForm
			title={t('modifyModuleVersion')}
			label={`${t('versionName')}`}
			showModifyValues={{
				name: moduleVersion.data?.name,
				description: moduleVersion.data?.description,
			}}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}
