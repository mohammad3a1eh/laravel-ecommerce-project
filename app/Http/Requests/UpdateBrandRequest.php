<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules()
    {
        $brandId = $this->route('brand')?->id;

        return [
            'name_fa' => 'required|string|max:255|unique:brands,name_fa' . $brandId,
            'name_en' => 'required|string|max:255|unique:brands,name_en' . $brandId,
            'slug' => 'nullable|string|alpha_dash|unique:brands,slug' . $brandId,
            'website' => 'nullable|url|max:255',
            'image' => 'nullable|image|max:2048',
            'remove_image' => 'nullable|boolean',
            'remove_banner' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'name_fa.required' => __('name fa is required'),
            'name_fa.unique' => __('name fa has already been taken'),
            'name_en.required' => __('name en is required'),
            'name_en.unique' => __('name en has already been taken'),
            'slug.alpha_dash' => __('slug must contain only lowercase letters, numbers and hyphens'),
            'slug.unique' => __('slug has already been taken'),
            'website.url' => __('website must be a valid URL'),
            'image.image' => __('only image files are allowed'),
        ];
    }
}
