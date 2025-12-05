<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name_fa' => 'required|string|max:255|unique:categories,name_fa',
            'slug' => 'required|string|alpha_dash|unique:categories,slug',
            'color' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:4096',
            'is_active' => 'required|boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ];
    }

    public function messages()
    {
        return [
            'name_fa.required' => __('name fa is required'),
            'name_fa.unique' => __('name fa has already been taken'),
            'slug.required' => __('slug is required'),
            'slug.alpha_dash' => __('slug must contain only lowercase letters, numbers and hyphens'),
            'slug.unique' => __('slug has already been taken'),
            'image.image' => __('only image files are allowed'),
            'banner.image' => __('only image files are allowed'),
            'is_active.boolean' => __('is active must be true or false'),
            'parent_id.exists' => __('parent category does not exist'),
        ];
    }
}
