import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { LinearProgress } from '@mui/material';
import { HideDuration, PathHolders } from '../../utils';
import {
	useGetSoftwareVersionById,
	useUpdateSoftwareVersion,
} from '../../services';

export default function ModifySoftwareVersionPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();
	const versionId = useParams()[PathHolders.SOFTWARE_VERSION_ID];
	const softwareVersion = useGetSoftwareVersionById(versionId!, {
		skip: !versionId,
	});
	useEffect(() => {
		if (softwareVersion.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, softwareVersion.isError, t]);

	const [updateSoftwareVersionTrigger] = useUpdateSoftwareVersion();

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		if (!versionId) return;

		if (!data.name.trim()) {
			notifications.show(t('softwareVersionNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await updateSoftwareVersionTrigger({
				versionId: versionId,
				name: data.name,
				description: data.description,
			});
			navigate(-1);
			notifications.show(t('updateSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	if (softwareVersion.isLoading) return <LinearProgress />;
	return (
		<CreateOrModifyForm
			title={t('modifySoftwareVersion')}
			label={`${t('versionName')}`}
			showModifyValues={{
				name: softwareVersion.data?.name,
				description: softwareVersion.data?.description,
			}}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}
