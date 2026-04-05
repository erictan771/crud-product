<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['Electronics', 'Clothing', 'Food & Beverage', 'Home & Living', 'Sports', 'Books', 'Beauty'];

        return [
            'name'        => fake()->words(fake()->numberBetween(2, 4), true),
            'description' => fake()->paragraph(2),
            'price'       => fake()->randomFloat(2, 5000, 2000000),
            'stock'       => fake()->numberBetween(0, 500),
            'category'    => fake()->randomElement($categories),
            'image_url'   => 'https://picsum.photos/seed/' . fake()->unique()->numberBetween(1, 1000) . '/400/400',
        ];
    }
}
