import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePage, router } from '@inertiajs/react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { route } from "ziggy-js";
import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { Command, CommandEmpty, CommandInput } from '@/components/ui/command';

export default function EditCategory() {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    const { categories, category } = usePage().props; // category از سرور برای ویرایش

    const categorySchema = z.object({
        name_fa: z.string().min(1, t("this field is required")),
        slug: z.string()
            .min(1, t("this field is required"))
            .regex(/^[a-z0-9-]+$/, t("only lowercase english letters numbers and hyphens are not allowed")),
        color: z.string().optional(),
        description: z.string().optional(),
        image: z
            .custom<FileList>()
            .refine((files) => !files || files.length === 0 || files[0].type.startsWith("image/"), t("only image files are allowed"))
            .optional(),
        banner: z
            .custom<FileList>()
            .refine((files) => !files || files.length === 0 || files[0].type.startsWith("image/"), t("only image files are allowed"))
            .optional(),
        is_active: z.boolean(),
        parent_id: z.string().nullable().optional(),
    });

    type CategoryFormValues = z.infer<typeof categorySchema>& {
        remove_image?: boolean;
        remove_banner?: boolean;
    };

    const { register, handleSubmit, control, setError, setValue, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name_fa: category.name_fa,
            slug: category.slug,
            color: category.color,
            description: category.description,
            is_active: category.is_active,
            parent_id: category.parent_id?.toString() ?? null,
        },
    });

    const [previewImage, setPreviewImage] = useState<string | null>(category.image_url ?? null);
    const [previewBanner, setPreviewBanner] = useState<string | null>(category.banner_url ?? null);

    const onSubmit = (data: CategoryFormValues) => {
        const formData = new FormData();

        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
            formData.append('remove_image', '0');
        } else if (data.remove_image) {
            formData.append('remove_image', '1');
        }

        if (data.banner && data.banner.length > 0) {
            formData.append('banner', data.banner[0]);
            formData.append('remove_banner', '0');
        } else if (data.remove_banner) {
            formData.append('remove_banner', '1');
        }

        formData.append('name_fa', data.name_fa);
        formData.append('slug', data.slug);
        if (data.color) formData.append('color', data.color);
        if (data.description) formData.append('description', data.description);

        // if (data.image && data.image.length > 0) formData.append('image', data.image[0]);
        // if (data.banner && data.banner.length > 0) formData.append('banner', data.banner[0]);

        formData.append('is_active', data.is_active ? '1' : '0');

        if (data.parent_id) formData.append('parent_id', data.parent_id);

        router.put(
            route("admin.categories.update", category.id),
            formData,
            {
                forceFormData: true,
                onError: (serverErrors) => {
                    Object.entries(serverErrors).forEach(([key, message]) => {
                        setError(key, {
                            type: 'server',
                            message: t(message),
                        });
                    });
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: t("categories"), href: route("admin.categories.create") },
            { title: t("edit"), href: '#' }
        ]}>
            <Head title={t("edit category")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4" autoComplete="off">
                    <Card className="grid auto-rows-min gap-4 md:grid-cols-2 p-4">
                        {/* فرم سمت چپ */}
                        <div className="flex flex-col gap-2">
                            <div>
                                <Label>{t("name fa")}</Label>
                                <Input {...register('name_fa')} dir="rtl"/>
                                <InputError message={errors.name_fa?.message} />
                            </div>

                            <div>
                                <Label>{t("slug")}</Label>
                                <Input {...register('slug')} dir="ltr"/>
                                <InputError message={errors.slug?.message} />
                            </div>

                            <div className="flex flex-row gap-4 my-2">
                                <Label>{t('color')}</Label>
                                <Input type="color" className="p-0 w-15 h-15 rounded-full" {...register('color')} />
                                <InputError message={errors.color?.message} />
                            </div>

                            <div>
                                <Label>{t('description')}</Label>
                                <Textarea {...register('description')} />
                                <InputError message={errors.description?.message} />
                            </div>

                            <div>
                                <Label>{t('image')}</Label>
                                <Input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    {...register('image')}
                                    onChange={(e) => {
                                        register('image').onChange(e);
                                        const file = e.target.files?.[0];
                                        if (file) setPreviewImage(URL.createObjectURL(file));
                                        else setPreviewImage(null);
                                    }}
                                    dir="ltr"
                                />
                                <InputError message={errors.image?.message} />
                            </div>

                            <div>
                                <Label>{t('banner')}</Label>
                                <Input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    {...register('banner')}
                                    onChange={(e) => {
                                        register('banner').onChange(e);
                                        const file = e.target.files?.[0];
                                        if (file) setPreviewBanner(URL.createObjectURL(file));
                                        else setPreviewBanner(null);
                                    }}
                                    dir="ltr"
                                />
                                <InputError message={errors.banner?.message} />
                            </div>

                            <div className="flex items-center space-x-2 my-2">
                                <Controller
                                    control={control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked === true)}
                                        />
                                    )}
                                />
                                <Label>{t('active')}</Label>
                            </div>

                            <div>
                                <Label>{t('parent')}</Label>
                                <Controller
                                    control={control}
                                    name="parent_id"
                                    render={({ field }) => (
                                        <Command>
                                            <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} value={field.value ?? 'none'}>
                                                <SelectTrigger dir={locale === "fa" ? "rtl" : "ltr"}>
                                                    <SelectValue placeholder={t('انتخاب کنید')} />
                                                </SelectTrigger>
                                                <SelectContent dir={locale === "fa" ? "rtl" : "ltr"}>
                                                    <SelectItem value="none">— {t('هیچ‌کدام')} —</SelectItem>
                                                    <CommandInput placeholder={t('جستجو کنید')} />
                                                    <CommandEmpty>{t('هیچ نتیجه‌ای پیدا نشد')}</CommandEmpty>
                                                    {categories?.map((cat: any) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.name_fa}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Command>
                                    )}
                                />
                                <InputError message={errors.parent_id?.message} />
                            </div>
                        </div>

                        {/* پیش‌نمایش تصویر و بنر */}
                        <div className="flex flex-col gap-4">
                            {previewImage && (
                                <div className="relative w-40 h-40 mx-auto my-auto">
                                    <img src={previewImage} alt="preview" className="w-full h-full object-cover rounded" />
                                    <Button
                                        type="button"
                                        className="absolute top-1 right-1 p-1 rounded w-8 h-8"
                                        variant="destructive"
                                        onClick={() => {
                                            setPreviewImage(null);
                                            setValue('image', undefined);
                                            setValue('remove_image', true);
                                        }}
                                    >
                                        <Trash width={12} height={12} />
                                    </Button>
                                </div>
                            )}

                            {previewBanner && (
                                <div className="relative aspect-4/1  mx-auto">
                                    <img src={previewBanner} alt="Banner preview" className="w-full h-full object-cover rounded" />
                                    <Button
                                        type="button"
                                        className="absolute top-1 right-1 p-1 rounded w-8 h-8"
                                        variant="destructive"
                                        onClick={() => {
                                            setPreviewBanner(null);
                                            setValue('banner', undefined);
                                            setValue('remove_banner', true);
                                        }}
                                    >
                                        <Trash width={12} height={12} />
                                    </Button>
                                </div>
                            )}
                        </div>

                    </Card>

                    <div className="flex flex-col gap-2 mt-4 sm:flex-row">
                        <Button type="submit" name="action" value="save">
                            {t("save")}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
