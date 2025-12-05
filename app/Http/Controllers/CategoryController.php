<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function create()
    {
        $categories = Category::select('id', 'name_fa')->get();

        return inertia('admin/categories/create', [
            'categories' => $categories,
        ]);
    }


    public function store(StoreCategoryRequest $request)
    {
        $category = new Category();
        $category->name_fa = $request->name_fa;
        $category->slug = $request->slug;
        $category->color = $request->color;
        $category->description = $request->description;
        $category->is_active = $request->is_active;
        $category->parent_id = $request->parent_id;

        if ($request->hasFile('image')) {
            $category->image = $request->file('image')->store('categories/images', 'public');
        }

        if ($request->hasFile('banner')) {
            $category->banner = $request->file('banner')->store('categories/banners', 'public');
        }

        $category->save();

        // تشخیص دکمه submit و ری‌دایرکت
//        $action = $request->input('action', 'save');
//        if ($action === 'save') {
//            return redirect()->route('dashboard')->with('success', 'دسته بندی ذخیره شد.');
//        } elseif ($action === 'saveAndEdit') {
//            return redirect()->route('admin.categories.create')->with('success', 'دسته بندی ذخیره شد. ادامه ویرایش.');
//        }
        return redirect()->route('dashboard')->with('success', 'دسته بندی ذخیره شد.');
    }

    public function edit(Category $category)
    {
        $categories = Category::where('id', '!=', $category->id)->orderBy('name_fa')->get(['id', 'name_fa']);

        return Inertia('admin/categories/edit', [
            'category' => [
                'id' => $category->id,
                'name_fa' => $category->name_fa,
                'slug' => $category->slug,
                'color' => $category->color,
                'description' => $category->description,
                'is_active' => $category->is_active,
                'parent_id' => $category->parent_id,
                'image_url' => $category->image ? asset('storage/' . $category->image) : null,
                'banner_url' => $category->banner ? asset('storage/' . $category->banner) : null,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {

        dd($request);

        $category->name_fa = $request->name_fa;
        $category->slug = $request->slug;
        $category->color = $request->color;
        $category->description = $request->description;
        $category->is_active = $request->is_active;
        $category->parent_id = $request->parent_id;

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $category->image = $request->file('image')->store('categories/images', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $category->image = null;
        }

        // مدیریت بنر
        if ($request->hasFile('banner')) {
            if ($category->banner) {
                Storage::disk('public')->delete($category->banner);
            }
            $category->banner = $request->file('banner')->store('categories/banners', 'public');
        } elseif ($request->boolean('remove_banner')) {
            if ($category->banner) {
                Storage::disk('public')->delete($category->banner);
            }
            $category->banner = null;
        }


        $category->save();

        return redirect()->route('admin.categories.create')->with('success', __('Category updated successfully'));
    }
}
