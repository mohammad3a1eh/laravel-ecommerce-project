<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBrandRequest;

class BrandController extends Controller
{
    public function index()
    {

        $brands = Brand::all();

        return inertia("admin/brands/index", [
            'brands' => $brands,
        ]);
    }

    public function create()
    {
        return inertia('admin/brands/create', []);
    }

    public function store(StoreBrandRequest $request)
    {
        $brand = new Brand();
        $brand->name_fa = $request->name_fa;
        $brand->name_en = $request->name_en;
        $brand->slug = $request->slug;
        $brand->website = $request->website;

        if ($request->hasFile('image')) {
            $brand->image = $request->file('image')->store('brands/images', 'public');
        }

        $brand->save();
    }

    public function edit(Brand $brand)
    {
        return inertia('admin/brands/edit', compact('brand'));
    }

    public function update(StoreBrandRequest $request, Brand $brand)
    {
        $brand->name_fa = $request->name_fa;
        $brand->name_en = $request->name_en;
        $brand->slug = $request->slug ?? \Str::slug($request->name_en);
        $brand->website = $request->website;
        $brand->is_active = $request->is_active;

        if ($request->hasFile('image')) {
            if ($brand->image) {
                \Storage::disk('public')->delete($brand->image);
            }
            $brand->image = $request->file('image')->store('brands/images', 'public');
        }

        $brand->save();

        return redirect()->route('admin.brands.index')->with('success', 'برند با موفقیت ویرایش شد');
    }
}
