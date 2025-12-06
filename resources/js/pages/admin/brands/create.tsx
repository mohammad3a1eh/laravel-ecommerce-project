'use client';

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';



export default function CreateBrand() {
    const { t } = useLaravelReactI18n();

    const brandSchema = z.object({
        name_fa: z.string().min(1, t("this field is required")),
        name_en: z.string().min(1, t("this field is required")),
        slug: z.string()
            .min(1, t("this field is required"))
            .regex(/^[a-z0-9-]+$/, t("only lowercase english letters numbers and hyphens are not allowed")),
        website: z.string().optional(),
        image: z
            .custom<FileList>()
            .refine((files) => !files || files.length === 0 || files[0].type.startsWith("image/"), "فقط فایل تصویر مجاز است")
            .optional(),

    });

    type BrandFormValues = z.infer<typeof brandSchema>;

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {},
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const onSubmit = (data: BrandFormValues) => {
        const formData = new FormData();
        formData.append('name_fa', data.name_fa);
        formData.append('name_en', data.name_en);
        if (data.slug) formData.append('slug', data.slug);
        if (data.website) formData.append('website', data.website);
        if (data.image && data.image.length > 0) formData.append('image', data.image[0]);

        router.post(route("admin.brands.store"), formData, {
            onSuccess: () => {
                toast.success(t("brand added successfully"));
                setTimeout(() => {
                    router.visit(route("admin.brands.index"));
                }, 1500);
            },
            onError: (serverErrors) => {
                Object.entries(serverErrors).forEach(([key, message]) => {
                    setValue(key as keyof BrandFormValues, undefined);
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: t("dashboard"), href: route("dashboard") },
            { title: t("brands"), href: route("admin.brands.index") },
            { title: t("create brand"), href: route("admin.brands.create") },
        ]}>
            <Head title={t("create brand")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4" autoComplete="off">
                    <Card className="grid auto-rows-min gap-4 md:grid-cols-2 p-4">

                        <div className="flex flex-col gap-4">
                            <div>
                                <Label>{t("name fa")}</Label>
                                <Input {...register('name_fa')} dir="rtl"/>
                                <InputError message={errors.name_fa?.message} />
                            </div>

                            <div>
                                <Label>{t("name en")}</Label>
                                <Input {...register('name_en')} dir="ltr"/>
                                <InputError message={errors.name_en?.message} />
                            </div>

                            <div>
                                <Label>{t("slug")}</Label>
                                <Input {...register('slug')} dir="ltr"/>
                                <InputError message={errors.slug?.message} />
                            </div>

                            <div>
                                <Label>{t("website")}</Label>
                                <Input {...register('website')} placeholder="https://example.com" dir="ltr"/>
                                <InputError message={errors.website?.message} />
                            </div>

                            <div>
                                <Label>{t("image")}</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    {...register('image')}
                                    onChange={(e) => {
                                        register('image').onChange(e);
                                        const file = e.target.files?.[0];
                                        if (file) setPreviewImage(URL.createObjectURL(file));
                                        else setPreviewImage(null);
                                    }}
                                />
                                <InputError message={errors.image?.message} />
                            </div>
                        </div>

                        {previewImage && (
                            <div className="relative w-40 h-40 mx-auto my-auto">
                                <img src={previewImage} alt="preview" className="w-full h-full object-cover rounded"/>
                                <Button
                                    type="button"
                                    className="absolute top-1 right-1 p-1 rounded w-8 h-8"
                                    variant="destructive"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        setValue('image', undefined);
                                    }}
                                >
                                    <Trash width={12} height={12} />
                                </Button>
                            </div>
                        )}

                    </Card>

                    <div className="flex flex-col gap-2 mt-4 sm:flex-row">
                        <Button type="submit">{t("save")}</Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
