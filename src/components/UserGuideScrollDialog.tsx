import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
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

	const descriptionElementRef = React.useRef<HTMLElement>(null);
	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open]);

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
					<DialogContentText
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						<Box p={1}>
							<ReactMarkdown>{t('useGuideDetail')}</ReactMarkdown>
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t('exit')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
