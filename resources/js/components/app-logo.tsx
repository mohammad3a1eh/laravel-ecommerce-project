import AppLogoIcon from './app-logo-icon';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function AppLogo() {
    const {t, currentLocale} = useLaravelReactI18n();
    const locale = currentLocale();

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className={`ml-1 grid flex-1 ${locale == 'fa' ? 'text-right' : 'text-left'} text-sm`} >
                <span className="mb-0.5 truncate leading-tight font-semibold" >
                    {t("dashboard")}
                </span>
            </div>
        </>
    );
}
