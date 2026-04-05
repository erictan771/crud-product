<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Tampilkan semua produk dengan search & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $perPage = $request->get('per_page', 10);
        $products = $query->latest()->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Simpan produk baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category'    => 'required|string|max:100',
            'image_url'   => 'nullable|url|max:500',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan.',
            'product' => $product,
        ], 201);
    }

    /**
     * Tampilkan detail satu produk.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update produk.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category'    => 'required|string|max:100',
            'image_url'   => 'nullable|url|max:500',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'product' => $product->fresh(),
        ]);
    }

    /**
     * Hapus produk.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    /**
     * Ambil daftar kategori unik.
     */
    public function categories(): JsonResponse
    {
        $categories = Product::select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return response()->json($categories);
    }
}
