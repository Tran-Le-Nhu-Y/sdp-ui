import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { LinearProgress } from '@mui/material';
import { hideDuration, PathHolders } from '../../utils';
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
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, softwareVersion.isError, t]);

	const [updateSoftwareVersionTrigger, updateSoftwareVersion] =
		useUpdateSoftwareVersion();
	useEffect(() => {
		if (updateSoftwareVersion.isError)
			notifications.show(t('updateSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (updateSoftwareVersion.isSuccess) {
			navigate(-1);
			notifications.show(t('updateSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [
		notifications,
		t,
		updateSoftwareVersion.isError,
		updateSoftwareVersion.isSuccess,
		navigate,
	]);

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		if (!versionId) return;

		await updateSoftwareVersionTrigger({
			versionId: versionId,
			name: data.name,
			description: data.description,
		});
	};

	if (softwareVersion.isLoading) return <LinearProgress />;
	return (
		<CreateOrModifyForm
			title={t('modifySoftwareVersion')}
			label={`${t('softwareVersionName')}`}
			showModifyValues={{
				name: softwareVersion.data?.name,
				description: softwareVersion.data?.description,
			}}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}
