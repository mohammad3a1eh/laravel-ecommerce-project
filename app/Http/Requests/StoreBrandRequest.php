<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBrandRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name_fa' => 'required|string|max:255|unique:brands,name_fa',
            'name_en' => 'required|string|max:255|unique:brands,name_en',
            'slug' => 'nullable|string|alpha_dash|unique:brands,slug',
            'website' => 'nullable|url|max:255',
            'image' => 'nullable|image|max:2048',
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
