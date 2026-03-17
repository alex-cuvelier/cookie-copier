import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

const MidnightForge = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03'
        },
        colorScheme: {
            light: {
                primary: { color: '#f59e0b', inverseColor: '#0f1117', hoverColor: '#fbbf24', activeColor: '#d97706' },
                highlight: { background: 'rgba(245, 158, 11, 0.12)', focusBackground: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', focusColor: '#fcd34d' },
                surface: {
                    0: '#0f1117',
                    50: '#181a22',
                    100: '#1e2029',
                    200: '#262832',
                    300: '#2e3140',
                    400: '#5c6370',
                    500: '#9ca3af',
                    600: '#d1d5db',
                    700: '#e5e7eb',
                    800: '#f1f1f4',
                    900: '#f9fafb',
                    950: '#ffffff'
                }
            },
            dark: {
                primary: { color: '#f59e0b', inverseColor: '#0f1117', hoverColor: '#fbbf24', activeColor: '#d97706' },
                highlight: { background: 'rgba(245, 158, 11, 0.12)', focusBackground: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', focusColor: '#fcd34d' },
                surface: {
                    0: '#0f1117',
                    50: '#181a22',
                    100: '#1e2029',
                    200: '#262832',
                    300: '#2e3140',
                    400: '#5c6370',
                    500: '#9ca3af',
                    600: '#d1d5db',
                    700: '#e5e7eb',
                    800: '#f1f1f4',
                    900: '#f9fafb',
                    950: '#ffffff'
                }
            }
        }
    }
});

export default {
    install(app) {
        app.use(PrimeVue, {
            theme: {
                preset: MidnightForge,
                options: {
                    darkModeSelector: false,
                    cssLayer: false
                }
            }
        });
        app.use(ToastService);
        app.directive('tooltip', Tooltip);
    }
};
