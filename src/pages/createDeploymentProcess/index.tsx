import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { CollapsibleDataGrid, DragAndDropForm } from '../../components';
import { useState } from 'react';
import { useGetAllSoftwareByUserId } from '../../services';

interface FileAttachment {
	id: number;
	name: string;
	size: string;
	status: 'loading' | 'complete' | 'failed';
	progress: number;
	error?: string;
}

export default function CreateDeploymentProcessPage() {
	const { t } = useTranslation();
	// const dataGridLocaleText = useDataGridTranslation();
	const navigate = useNavigate();
	const [, setFiles] = useState<FileAttachment[]>([]);

	const handleSubmit = () => {
		navigate(-1); // back to previous page
	};
	const handleCancel = () => {
		navigate(-1); // back to previous page
	};

	const handleFilesChange = (uploadedFiles: FileAttachment[]) => {
		setFiles(uploadedFiles);
	};

	const [openSoftwareTable, setOpenSoftwareTable] = useState(false);
	const [selectedSoftware, setSelectedSoftware] = useState<{
		id: string;
		name: string;
	}>();
	const [softwareQuery, setSoftwareQuery] = useState<GetAllSoftwareQuery>({
		userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		pageNumber: 0,
		pageSize: 6,
	});
	const software = useGetAllSoftwareByUserId(softwareQuery!, {
		skip: !softwareQuery || softwareQuery?.pageSize === 0,
	});

	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDeployProductInfor')}
			</Typography>

			<CollapsibleDataGrid
				open={openSoftwareTable}
				label={t('software')}
				title={selectedSoftware?.name ?? t('notSelected')}
				onOpenChange={(isOpen) => setOpenSoftwareTable(isOpen)}
				dataProps={{
					pageSizeOptions: [5, 10, 25],
					loading: software.isLoading,
					rows: software.data?.content,
					rowCount: software?.data?.totalElements,
					columns: [
						{
							field: 'name',
							headerName: t('softwareName'),
							sortable: false,
							editable: false,
							filterable: false,
							headerAlign: 'center',
							width: 400,
							minWidth: 250,
						},
						{
							field: 'createdAt',
							headerName: t('dateCreated'),
							sortable: false,
							editable: false,
							filterable: false,
							headerAlign: 'center',
							align: 'center',
							minWidth: 250,
						},
						{
							field: 'updatedAt',
							headerName: t('lastUpdated'),
							sortable: false,
							editable: false,
							filterable: false,
							headerAlign: 'center',
							align: 'center',
							minWidth: 250,
						},
					],
					initialState: {
						pagination: {
							paginationModel: { pageSize: 5, page: 0 },
						},
					},
					checkboxSelection: true,
					disableMultipleRowSelection: true,
					getRowId: (row: Software) => `${row.id}$${row.name}`,
					rowSelectionModel:
						selectedSoftware &&
						`${selectedSoftware.id}$${selectedSoftware.name}`,
					onRowSelectionModelChange: (model) => {
						if (model.length === 1) {
							const [id, name] = model[0].toString().split('$');
							setSelectedSoftware({ id, name });
						} else setSelectedSoftware(undefined);
					},
					onPaginationModelChange: (model) =>
						setSoftwareQuery((pre) => ({
							...pre,
							pageNumber: model.page,
							pageSize: model.pageSize,
						})),
				}}
			/>

			<Stack mt={1}>
				<Typography variant="subtitle1" mb={1}>
					{t('description')}
				</Typography>
				<Box mb={1}>
					<TextField
						fullWidth
						size="medium"
						value={''}
						onChange={(e) => e.target.value}
						placeholder={`${t('enter')} ${t('description').toLowerCase()}...`}
						multiline
						rows={4}
					/>
				</Box>

				<DragAndDropForm onFilesChange={handleFilesChange} />
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					{t('submit')}
				</Button>
				<Button variant="outlined" color="secondary" onClick={handleCancel}>
					{t('cancel')}
				</Button>
			</Box>
		</Stack>
	);
}
