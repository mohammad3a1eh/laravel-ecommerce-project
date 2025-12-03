import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function ConfirmPassword() {
    const {t, currentLocale} = useLaravelReactI18n();
    const locale = currentLocale();

    return (
        <AuthLayout
            title={t("confirm your password")}
            description={t(
                "this is a secure area of the application. please confirm your password before continuing."
            )}
        >
            <Head title={t("confirm password")} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">{t("password")}</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder={t("password")}
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                {t("confirm password")}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>

    );
}
