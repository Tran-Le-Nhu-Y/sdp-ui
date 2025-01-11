import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

const getRandomColor = () => {
	// Generate a random hex color
	return `#${Math.floor(Math.random() * 20052003)
		.toString(16)
		.padStart(6, '0')}`;
};

const LabelManager: React.FC = () => {
	const { t } = useTranslation();
	const [showNewLabel, setShowNewLabel] = useState(false);
	const [labelName, setLabelName] = useState('Label name');
	const [labelColor, setLabelColor] = useState('#0e8a16');

	const handleNewLabelClick = () => {
		setShowNewLabel(true);
	};

	const handleRandomColor = () => {
		const randomColor = getRandomColor();
		setLabelColor(randomColor);
	};

	const handleCancel = () => {
		setShowNewLabel(false);
		setLabelName('Label name');
		setLabelColor('#0e8a16');
	};

	const handleCreateLabel = () => {
		alert(`Label Created: ${labelName} (${labelColor})`);
		setShowNewLabel(false);
		setLabelName('Label name');
		setLabelColor('#0e8a16');
	};

	return (
		<Box sx={{ padding: 2 }}>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<Stack direction="row" spacing={1} alignItems="center">
					<TextField
						placeholder={t('search') as string}
						size="small"
						variant="outlined"
						sx={{ width: 300 }}
					/>
				</Stack>
				<Button
					variant="contained"
					color="success"
					onClick={handleNewLabelClick}
				>
					{t('addDocumentLabel')}
				</Button>
			</Stack>
			{showNewLabel && (
				<Box
					sx={{
						padding: 2,
						border: '1px solid #e0e0e0',
						borderRadius: '8px',
						backgroundColor: '#f9f9f9',
					}}
				>
					<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
						<Typography variant="subtitle1">{t('labelPreview')}:</Typography>
						<Chip
							label={labelName || 'Label name'}
							size="small"
							sx={{
								backgroundColor: labelColor,
								color: '#fff',
								fontWeight: 'bold',
							}}
						/>
					</Stack>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							label={t('labelName') as string}
							value={labelName}
							onChange={(e) => setLabelName(e.target.value)}
							variant="outlined"
							size="small"
							fullWidth
						/>
						<TextField
							label={t('description') as string}
							variant="outlined"
							size="small"
							fullWidth
						/>
						<Stack direction="row" spacing={1} alignItems="center">
							<IconButton color="secondary" onClick={handleRandomColor}>
								<CachedIcon />
							</IconButton>
							<TextField
								label={t('color') as string}
								value={labelColor}
								onChange={(e) => setLabelColor(e.target.value)}
								variant="outlined"
								size="small"
								sx={{ width: 120 }}
							/>
						</Stack>
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
						<Button variant="outlined" onClick={handleCancel}>
							{t('cancel')}
						</Button>
						<Button
							variant="contained"
							color="success"
							onClick={handleCreateLabel}
						>
							{t('submit')}
						</Button>
					</Stack>
				</Box>
			)}
		</Box>
	);
};

export default LabelManager;
