<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use Illuminate\Support\Facades\Storage;

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
        return inertia("admin/brands/edit", [
            "brand" => [
                "id" => $brand->id,
                "name_fa" => $brand->name_fa,
                "name_en" => $brand->name_en,
                "slug" => $brand->slug,
                "website" => $brand->website,
                "image_url" => $brand->image ? asset("storage/" . $brand->image) : null,
            ],
        ]);
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $brand->name_fa = $request->name_fa;
        $brand->name_en = $request->name_en;
        $brand->slug = $request->slug ?? \Str::slug($request->name_en);
        $brand->website = $request->website;

        if ($request->hasFile('image')) {
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image);
            }
            $brand->image = $request->file('image')->store('brands/images', 'public');
        }

        $brand->save();
    }

    public function destroy(Brand $brand)
    {
        if ($brand->image) {
            Storage::disk('public')->delete($brand->image);
        }

        $brand->delete();
    }
}
