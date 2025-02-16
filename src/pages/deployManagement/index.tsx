import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaginationTable } from '../../components';
import { useState } from 'react';
// import { useNotifications } from '@toolpad/core';
import { Box, IconButton, Stack, TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function DeployManagementPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [deploymentTablePage, setDeploymentTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const deployments = [
		{
			id: '1',
			name: 'Phần mềm A',
			status: 'Mới',
			startDate: '01/01/2025',
			endDate: '01/01/2025',
		},
		{
			id: '2',
			name: 'Phần mềm B',
			status: 'Đang triển khai',
			startDate: '01/01/2025',
			endDate: '01/01/2025',
		},
		{
			id: '3',
			name: 'Phần mềm C',
			status: 'Hoàn thành',
			startDate: '01/01/2025',
			endDate: '01/01/2025',
		},
	];
	const handleDelete = (id: string) => {
		alert(`Xóa khách hàng có ID: ${id}`);
	};

	return (
		<Box>
			<PaginationTable
				headers={
					<>
						<TableCell key={`deployFor`}>{t('deployFor')}</TableCell>
						<TableCell key={`status`} align="center">
							{t('status')}
						</TableCell>
						<TableCell key={`startDate`} align="center">
							{t('startDate')}
						</TableCell>
						<TableCell key={`endDate`} align="center">
							{t('endDate')}
						</TableCell>
						<TableCell />
					</>
				}
				count={deployments.length ?? 0}
				rows={deployments}
				pageNumber={deploymentTablePage.pageNumber}
				pageSize={deploymentTablePage.pageSize}
				onPageChange={(newPage) => setDeploymentTablePage(newPage)}
				// onAddClick={() => navigate(`/create-deployment`)}
				addButtonText={t('addDeployment')}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`deployFor`}>{row.name}</TableCell>
						<TableCell key={`status`} align="center">
							{row.status}
						</TableCell>
						<TableCell key={`startDate`} align="center">
							{row.startDate}
						</TableCell>
						<TableCell key={`endDate`} align="center">
							{row.endDate}
						</TableCell>

						<TableCell>
							<Stack direction="row">
								<IconButton size="small" onClick={() => {}}>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton size="small" onClick={() => {}}>
									<EditIcon color="info" />
								</IconButton>
								<IconButton size="small" onClick={() => handleDelete(row.id)}>
									<DeleteIcon color="error" />
								</IconButton>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
		</Box>
	);
}
