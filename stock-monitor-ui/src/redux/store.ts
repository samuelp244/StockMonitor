import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer';
// import caDataReducer from './caDataReducer';
export const store = configureStore({
	reducer: {
		auth: authReducer,
		// caData: caDataReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;