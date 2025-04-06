import { useEffect } from 'react';
import { PathHolders, RoutePaths } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Button,
	LinearProgress,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import { useGetSoftwareLicenseDetailById } from '../../services';

const SoftwareLicenseDetailPage = () => {
	const { t } = useTranslation('standard');
	const licenseId = useParams()[PathHolders.SOFTWARE_LICENSE_ID];
	const navigate = useNavigate();
	const theme = useTheme();

	useEffect(() => {
		if (!licenseId) navigate(RoutePaths.OVERVIEW, { replace: true });
	}, [licenseId, navigate]);

	const licenseQuery = useGetSoftwareLicenseDetailById(licenseId!, {
		skip: !licenseId,
	});

	return (
		<Stack spacing={2} alignItems={'center'} width="100%">
			<Typography variant="h4">{t('licenseDetailInfor')}</Typography>

			{(licenseQuery.isLoading || licenseQuery.isFetching) && (
				<LinearProgress />
			)}

			<Stack direction={'row'} width={'100%'} flexWrap={'wrap'}>
				<Stack
					sx={{
						[theme.breakpoints.up('lg')]: { width: '50%' },
						[theme.breakpoints.down('lg')]: { width: '100%' },
					}}
					spacing={1}
				>
					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">{t('softwareLicenseId')}:</Typography>
						<Typography lineHeight={2}>{licenseQuery.data?.id}</Typography>
					</Typography>

					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">{t('licenseStartTime')}:</Typography>
						<Typography lineHeight={2}>
							{licenseQuery.data &&
								new Date(licenseQuery.data.startTimeMs).toLocaleString()}
						</Typography>
					</Typography>

					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">{t('licenseEndTime')}:</Typography>
						<Typography lineHeight={2}>
							{licenseQuery.data &&
								new Date(licenseQuery.data.endTimeMs).toLocaleString()}
						</Typography>
					</Typography>

					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">{t('creator')}:</Typography>
						<Typography lineHeight={2}>
							{licenseQuery.data &&
								`${licenseQuery.data.creator.lastName} ${licenseQuery.data.creator.firstName}`}
						</Typography>
					</Typography>

					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">Email:</Typography>
						<Typography lineHeight={2}>
							{licenseQuery.data && licenseQuery.data.creator.email}
						</Typography>
					</Typography>

					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">{t('licenseFor')}:</Typography>
						<Tooltip
							arrow
							title={`${t('navigateTo')} ${t('process')} ${licenseQuery.data?.processId}`}
						>
							<Button
								color="info"
								variant="outlined"
								onClick={() => {
									const path = RoutePaths.DEPLOYMENT_PROCESS_DETAIL.replace(
										`:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
										`${licenseQuery.data?.processId ?? ''}`,
									);
									navigate(path);
								}}
							>
								{t('process')} {licenseQuery.data?.processId}
							</Button>
						</Tooltip>
					</Typography>
				</Stack>

				<Stack
					sx={{
						[theme.breakpoints.up('lg')]: { width: '50%' },
						[theme.breakpoints.down('lg')]: { width: '100%' },
					}}
					spacing={1}
				>
					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">
							{t('expiredAlertIntervalDays')}:
						</Typography>
						<Typography lineHeight={2}>
							{licenseQuery.data?.expireAlertIntervalDay ?? 0} {t('days')}
						</Typography>
					</Typography>
					<Typography component={'span'} display={'inline-flex'} gap={1}>
						<Typography variant="h6">
							{t('isExpiredLicenseAlertDone')}:
						</Typography>
						<Typography lineHeight={2}>
							{licenseQuery.data?.isExpireAlertDone
								? t('alreadySent')
								: t('notSent')}
						</Typography>
					</Typography>
					<Stack spacing={1}>
						<Typography variant="h6">{t('description')}:</Typography>
						<TextField
							slotProps={{
								input: {
									readOnly: true,
								},
							}}
							fullWidth
							multiline
							rows={4}
							value={licenseQuery.data?.description}
						/>
					</Stack>
				</Stack>
			</Stack>

			<Button
				variant="outlined"
				onClick={() => {
					navigate(RoutePaths.EXPIRED_SOFTWARE_LICENSES, { replace: true });
				}}
			>
				{t('return')}
			</Button>
		</Stack>
	);
};

export default SoftwareLicenseDetailPage;
