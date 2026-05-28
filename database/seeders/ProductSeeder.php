<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        if (Product::query()->exists()) {
            return;
        }

        $categories = ['General', 'Electronics', 'Books', 'Fashion'];

        for ($i = 1; $i <= 5; $i++) {
            Product::query()->create([
                'name' => "Product {$i}",
                'description' => "Seeded product #{$i}",
                'price' => 10_000 + ($i * 1_500),
                'stock' => 100 - $i,
                'category' => $categories[$i % count($categories)],
                'image_url' => null,
            ]);
        }
    }
}
