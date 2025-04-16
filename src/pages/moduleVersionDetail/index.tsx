import {
	Typography,
	IconButton,
	Stack,
	Box,
	Divider,
	LinearProgress,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';
import { ReadonlyTextEditor } from '../../components';
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useDeleteModuleVersion,
	useGetModuleById,
	useGetModuleVersionById,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';
import DocumentsOfVersionTable from './DocumentsOfVersionTable';

const ModuleVersionDetailPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dialogs = useDialogs();
	// const dispatch = useDispatch();
	const [showDocumentTable, setShowDocumentTable] = useState(false);
	const notifications = useNotifications();
	const versionId = useParams()[PathHolders.MODULE_VERSION_ID];

	//moduleVersion
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

	const [deleteModuleVersionTrigger, deleteModuleVersion] =
		useDeleteModuleVersion();
	useEffect(() => {
		if (deleteModuleVersion.isError)
			notifications.show(t('deleteModuleVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteModuleVersion.isSuccess) {
			navigate(-1);
			notifications.show(t('deleteModuleVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		}
	}, [
		deleteModuleVersion.isError,
		deleteModuleVersion.isSuccess,
		notifications,
		t,
		navigate,
	]);
	const handleDeleteModuleVersion = async (versionId: string) => {
		const confirmed = await dialogs.confirm(t('deleteModuleVersionConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteModuleVersionTrigger(versionId);
	};

	//document
	const [documentQuery, setDocumentQuery] =
		useState<GetAllModuleDocumentQuery | null>({
			moduleVersionId: versionId!,
			moduleDocumentName: '',
			pageSize: 5,
			pageNumber: 0,
		});

	const moduleId = useParams()[PathHolders.MODULE_ID];
	const module = useGetModuleById(moduleId!, { skip: !moduleId });

	if (moduleVersion.isLoading) return <LinearProgress />;
	return (
		<Stack>
			<Stack alignItems={'center'}>
				<Typography variant="h5" textAlign="center">
					{module.data?.name ?? ''}
				</Typography>
				<Stack direction={'row'} spacing={3}>
					<Stack direction={'row'} spacing={1} alignItems={'center'}>
						<Typography variant="body2">{t('dateCreated')}:</Typography>
						<Typography variant="body2">
							{moduleVersion.data?.createdAt}
						</Typography>
					</Stack>
					<Stack direction={'row'} spacing={1} alignItems={'center'}>
						<Typography variant="body2">{t('lastUpdated')}: </Typography>
						<Typography variant="body2">
							{moduleVersion.data?.updatedAt}
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack spacing={5} justifyContent={'space-between'}>
				<Stack>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent={'space-between'}
					>
						<Box display="flex" alignItems="center">
							<Typography variant="body2">{t('version')}:</Typography>
							<Typography variant="body2" marginLeft={1}>
								{moduleVersion.data?.name}
							</Typography>
						</Box>

						<Box display="flex" alignItems="center">
							<Box>
								<IconButton
									color="primary"
									onClick={() =>
										navigate(
											RoutePaths.MODIFY_MODULE_VERSION.replace(
												`:${PathHolders.MODULE_VERSION_ID}`,
												versionId || '',
											),
										)
									}
								>
									<Edit />
								</IconButton>
								<IconButton
									color="error"
									onClick={async () =>
										handleDeleteModuleVersion(versionId || '')
									}
								>
									<Delete />
								</IconButton>
							</Box>
						</Box>
					</Stack>

					<Box>
						<Typography variant="body2">{t('description')}:</Typography>
						<ReadonlyTextEditor data={moduleVersion.data?.description ?? ''} />
					</Box>
				</Stack>

				<Stack>
					<Stack
						direction={'row'}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ opacity: 0.8 }}
						>
							{t('documentsOfVersion')}
						</Typography>
						<IconButton
							onClick={() => setShowDocumentTable(!showDocumentTable)}
						>
							{showDocumentTable ? (
								<KeyboardArrowUpIcon />
							) : (
								<KeyboardArrowDownIcon />
							)}
						</IconButton>
					</Stack>
					{!showDocumentTable && <Divider />}
					<Stack>
						{showDocumentTable && (
							<Stack mt={1}>
								<DocumentsOfVersionTable
									versionId={versionId ?? ''}
									documentQuery={documentQuery}
									onQueryChange={(query) => setDocumentQuery(query)}
								/>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ModuleVersionDetailPage;
