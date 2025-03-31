import { useEffect } from 'react';
import { PathHolders, RoutePaths } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';

const SoftwareLicenseDetailPage = () => {
	const { t } = useTranslation('standard');
	const licenseId = useParams()[PathHolders.SOFTWARE_LICENSE_ID];
	const navigate = useNavigate();

	useEffect(() => {
		if (!licenseId) navigate(RoutePaths.OVERVIEW, { replace: true });
	}, [licenseId, navigate]);

	return <Stack spacing={2}></Stack>;
};

export default SoftwareLicenseDetailPage;
