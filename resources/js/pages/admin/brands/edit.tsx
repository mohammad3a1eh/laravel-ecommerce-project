import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from "ziggy-js";

export default function EditBrand() {
    const { t } = useLaravelReactI18n();
    const { brand } = usePage().props as { brand: any };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t("dashboard"), href: route("dashboard") },
        { title: t("brands"), href: route("admin.brands.index") },
        { title: t("edit brand"), href: route("admin.brands.edit", brand.id) },
    ];

    const brandSchema = z.object({
        name_fa: z.string().min(1, t("this field is required")),
        name_en: z.string().min(1, t("this field is required")),
        slug: z.string()
            .min(1, t("this field is required"))
            .regex(/^[a-z0-9-]+$/, t("only lowercase english letters numbers and hyphens are allowed")),
        website: z.string().url(t("website must be a valid URL")).optional().or(z.literal("")),
        image: z
            .custom<FileList>()
            .refine((files) => !files || files.length === 0 || files[0].type.startsWith("image/"), t("only image files are allowed"))
            .optional(),
    });

    type BrandFormValues = z.infer<typeof brandSchema> & {
        remove_image?: boolean;
    };

    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name_fa: brand.name_fa,
            name_en: brand.name_en,
            slug: brand.slug,
            website: brand.website ?? "",
        },
    });

    const [previewImage, setPreviewImage] = useState<string | null>(brand.image_url ?? null);
    const [removeImage, setRemoveImage] = useState<boolean>(false);

    const onSubmit = (data: BrandFormValues) => {
        const formData = new FormData();

        if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
            formData.append("remove_image", "0");
        } else if (removeImage) {
            formData.append("remove_image", "1");
        }

        formData.append("name_fa", data.name_fa);
        formData.append("name_en", data.name_en);
        formData.append("slug", data.slug);
        formData.append("website", data.website ?? "");

        router.post(
            route("admin.brands.update", brand.id),
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    toast.success(t("brand updated successfully"));
                    setTimeout(() => {
                        router.visit(route("admin.brands.index"));
                    }, 1200);
                },
                onError: (serverErrors) => {
                    Object.entries(serverErrors).forEach(([key, message]) => {
                        setError(key as any, {
                            type: 'server',
                            message: t(message),
                        });
                    });
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t("edit brand")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">

                    <Card className="grid auto-rows-min gap-4 md:grid-cols-2 p-4">
                        <div className="flex flex-col gap-4">

                            <div>
                                <Label>{t("name fa")}</Label>
                                <Input {...register("name_fa")} dir="rtl" />
                                <InputError message={errors.name_fa?.message} />
                            </div>

                            <div>
                                <Label>{t("name en")}</Label>
                                <Input {...register("name_en")} dir="ltr" />
                                <InputError message={errors.name_en?.message} />
                            </div>

                            <div>
                                <Label>{t("slug")}</Label>
                                <Input {...register("slug")} dir="ltr" />
                                <InputError message={errors.slug?.message} />
                            </div>

                            <div>
                                <Label>{t("website")}</Label>
                                <Input {...register("website")} dir="ltr" placeholder="https://example.com" />
                                <InputError message={errors.website?.message} />
                            </div>

                            <div>
                                <Label>{t("image")}</Label>
                                <Input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    {...register("image")}
                                    onChange={(e) => {
                                        register("image").onChange(e);
                                        const file = e.target.files?.[0];
                                        if (file) setPreviewImage(URL.createObjectURL(file));
                                        else setPreviewImage(null);
                                        setRemoveImage(false);
                                    }}
                                />
                                <InputError message={errors.image?.message} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {previewImage && (
                                <div className="relative w-40 h-40 mx-auto">
                                    <img src={previewImage} className="w-full h-full object-cover rounded" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="absolute top-1 right-1 p-1 rounded w-8 h-8"
                                        onClick={() => {
                                            setPreviewImage(null);
                                            setValue("image", undefined);
                                            setValue("remove_image", true);
                                            setRemoveImage(true);
                                        }}
                                    >
                                        <Trash width={12} height={12} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Button type="submit">{t("save")}</Button>
                </form>
            </div>
        </AppLayout>
    );
}
