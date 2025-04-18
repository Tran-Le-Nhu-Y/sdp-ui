import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function UserGuideScrollDialog() {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(false);
	const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

	const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
		setOpen(true);
		setScroll(scrollType);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<React.Fragment>
			<Button onClick={handleClickOpen('paper')}>{t('guide')}</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title" color="primary">
					{t('instructionForWritingMailTemplate')}
				</DialogTitle>
				<DialogContent dividers={scroll === 'paper'}>
					<ReactMarkdown>{t('useGuideDetail')}</ReactMarkdown>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t('exit')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
