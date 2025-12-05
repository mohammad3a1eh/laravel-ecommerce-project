import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const rawLocale = props.initialPage.props.locale;
        const locale = typeof rawLocale === 'string' ? rawLocale : 'en';

        // default root.render
        // root.render(
        //     <StrictMode>
        //         <App {...props} />
        //     </StrictMode>,
        // );

        root.render(
            // #localization
            <StrictMode>
                <LaravelReactI18nProvider
                    locale={locale}
                    fallbackLocale={'en'}
                    // files={import.meta.glob('/lang/*.json')}
                    files={import.meta.glob('/lang/*.json')}
                >
                    <App {...props} />
                </LaravelReactI18nProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#FF3838',
    },
});

// This will set light / dark mode on load...
initializeTheme();
