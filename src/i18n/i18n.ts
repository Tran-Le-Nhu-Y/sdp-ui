import { initReactI18next } from 'react-i18next/initReactI18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import standardVi from './locales/vi/standard.json';

export const defaultNS = 'standard';
export const resources = {
	vi: {
		standard: standardVi,
	},
} as const;
export const supportedLngs = ['vi'] as const;

i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		lng: undefined,
		ns: ['standard'],
		supportedLngs,
		defaultNS,
		resources,
	});
