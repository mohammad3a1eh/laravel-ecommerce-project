// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useLaravelReactI18n();

    return (
        <AuthLayout
            title={t('verify email')}
            description={t(
                'please verify your email address by clicking on the link we just emailed to you'
            )}
        >
            <Head title={t('email verification')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t(
                        'a new verification link has been sent to the email address you provided during registration'
                    )}
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            {t('resend verification email')}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            {t('log out')}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
