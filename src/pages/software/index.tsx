import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterDialog,
	ReadonlyTextEditor,
} from '../../components';
import { useTranslation } from 'react-i18next';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteSoftware, useGetAllSoftwareByUserId } from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';
import SoftwareVersionInner from './SoftwareVersionInner';

export default function SoftwarePage() {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const session = useSession();
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);

	const [softwareQuery, setSoftwareQuery] = useState<GetAllSoftwareQuery>({
		userId: session?.user?.id ?? '',
		softwareName: '',
		pageNumber: 0,
		pageSize: 6,
	});
	const software = useGetAllSoftwareByUserId(softwareQuery!, {
		skip: !softwareQuery,
	});
	useEffect(() => {
		if (software.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, software.isError, t]);

	const [deleteSoftwareTrigger, deleteSoftware] = useDeleteSoftware();
	useEffect(() => {
		if (deleteSoftware.isError)
			notifications.show(t('deleteProductError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteSoftware.isSuccess)
			notifications.show(t('deleteProductSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
	}, [deleteSoftware.isError, deleteSoftware.isSuccess, notifications, t]);
	const handleDelete = async (productId: string) => {
		const confirmed = await dialogs.confirm(t('deleteProductConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
			severity: 'error',
		});
		if (!confirmed) return;

		await deleteSoftwareTrigger(productId);
	};

	const [versionQuery, setVersionQuery] =
		useState<GetAllSoftwareVersionQuery | null>(null);

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<FilterDialog
					filters={[
						{
							key: 'softwareName',
							label: t('softwareName'),
						},
					]}
					open={filterDialogOpen}
					onClose={() => setFilterDialogOpen(false)}
					onOpen={() => setFilterDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						setSoftwareQuery((prev) => ({ ...prev, ...query }));
					}}
					onReset={() => {
						setSoftwareQuery((prev) => ({ ...prev, softwareName: '' }));
					}}
				/>
				<Button
					variant="contained"
					onClick={() => navigate(RoutePaths.CREATE_SOFTWARE)}
				>
					{t('addSoftware')}
				</Button>
			</Stack>

			{(software.isLoading || deleteSoftware.isLoading) && <LinearProgress />}
			<CollapsibleTable
				headers={
					<>
						<TableCell key="name">{t('softwareName')}</TableCell>
						<TableCell key="createdAt" align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key="updatedAt" align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				rows={software.data?.content ?? []}
				count={software.data?.totalElements ?? 0}
				pageNumber={softwareQuery?.pageNumber}
				pageSize={softwareQuery?.pageSize}
				onPageChange={(newPage) =>
					setSoftwareQuery((prev) => {
						return { ...prev, ...newPage };
					})
				}
				getCell={(row) => (
					<CollapsibleTableRow
						key={row.id}
						cells={
							<>
								<TableCell align="justify" component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="center">{row.createdAt}</TableCell>
								<TableCell align="center">{row.updatedAt}</TableCell>

								<TableCell align="center">
									<IconButton
										onClick={() =>
											navigate(
												RoutePaths.MODIFY_SOFTWARE.replace(
													`:${PathHolders.SOFTWARE_ID}`,
													row.id
												)
											)
										}
									>
										<EditIcon color="info" />
									</IconButton>
									<IconButton onClick={async () => handleDelete(row.id)}>
										<DeleteIcon color="error" />
									</IconButton>
								</TableCell>
							</>
						}
						inner={
							<Stack spacing={3}>
								<ReadonlyTextEditor
									data={row.description ?? undefined}
									placeHolder={t('description')}
								/>
								<Typography variant="h6" textAlign="center">
									{t('softwareVersionList')}
								</Typography>
								<SoftwareVersionInner
									softwareId={row.id}
									versionQuery={versionQuery}
									onQueryChange={(query) => setVersionQuery(query)}
								/>
							</Stack>
						}
						onExpand={() => {
							setVersionQuery({
								softwareId: row.id,
								versionName: '',
								pageNumber: 0,
								pageSize: 5,
							});
						}}
					/>
				)}
			/>
		</Box>
	);
}
