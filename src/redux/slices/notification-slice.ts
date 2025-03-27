import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const notificationSlice = createSlice({
	name: 'notifications',
	initialState: { unread: 0 },
	reducers: {
		increaseUnread: (state, action: PayloadAction<number>) => {
			state.unread += action.payload;
		},
		decreaseUnread: (state, action: PayloadAction<number>) => {
			const newValue = state.unread - action.payload;
			state.unread = newValue >= 0 ? newValue : 0;
		},
	},
});

export const { increaseUnread, decreaseUnread } = notificationSlice.actions;

export const getNotificationState = (state: RootState) => state.notifications;

export default notificationSlice;
