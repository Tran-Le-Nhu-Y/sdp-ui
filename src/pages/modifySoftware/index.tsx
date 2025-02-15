import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSoftwareById, useUpdateSoftware } from '../../services';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { LinearProgress } from '@mui/material';
import { hideDuration, PathHolders } from '../../utils';

export default function ModifySoftwarePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const softwareId = useParams()[PathHolders.SOFTWARE_ID];
	const notifications = useNotifications();

	const software = useGetSoftwareById(softwareId!, { skip: !softwareId });
	useEffect(() => {
		if (software.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, software.isError, t]);

	const [updateSoftwareTrigger, updateSoftware] = useUpdateSoftware();
	useEffect(() => {
		if (updateSoftware.isError)
			notifications.show(t('updateSoftwareError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (updateSoftware.isSuccess) {
			// navigate(-1);
			notifications.show(t('updateSoftwareSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [
		notifications,
		t,
		updateSoftware.isError,
		updateSoftware.isSuccess,
		navigate,
	]);

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		if (!softwareId) return;

		await updateSoftwareTrigger({
			softwareId: softwareId,
			name: data.name,
			description: data.description,
		});
	};

	if (software.isLoading) return <LinearProgress />;
	return (
		<CreateOrModifyForm
			title={t('modifySoftware')}
			label={`${t('softwareName')}`}
			showModifyValues={{
				name: software.data?.name,
				description: software.data?.description,
			}}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}
