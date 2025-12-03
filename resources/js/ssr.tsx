import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {

            const rawLocale = props.initialPage.props.locale;
            const locale = typeof rawLocale === 'string' ? rawLocale : 'en';

            return (
                // #localization
                <LaravelReactI18nProvider
                    locale={locale}
                    fallbackLocale={'en'}
                    files={import.meta.glob('/lang/*.json', { eager: true })}
                >
                    <App {...props} />
                </LaravelReactI18nProvider>
            );
        },
    }),
);
