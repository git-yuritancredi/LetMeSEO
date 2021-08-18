import i18n from 'i18n';
import path from 'path';

i18n.configure({
	locales: ['en', 'it'],
	directory: path.join(__dirname, '/../locales'),
	defaultLocale: 'en'
});

export {i18n}
