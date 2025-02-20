import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSoftwareById, useUpdateSoftware } from '../../services';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { LinearProgress } from '@mui/material';
import { HideDuration, PathHolders } from '../../utils';

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
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, software.isError, t]);

	const [updateSoftwareTrigger] = useUpdateSoftware();

	const handleSubmit = async (data: {
		name: string;
		description: string | null;
	}) => {
		if (!softwareId) return;

		if (!data.name.trim()) {
			notifications.show(t('softwareNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await updateSoftwareTrigger({
				softwareId: softwareId,
				name: data.name,
				description: data.description,
			});
			navigate(-1);
			notifications.show(t('updateSoftwareSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateSoftwareError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
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
