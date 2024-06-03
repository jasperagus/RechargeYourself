<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Data;

class DataFactory extends Factory
{
    protected $model = Data::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Song_Number' => $this->faker->numberBetween(1, 10), 
            'Date' => $this->faker->date('Y-m-d'), 
            'Start_Time' => $this->faker->time('H:i:s', 'now'), // Generate a random time for start time
            'End_Time' => $this->faker->dateTimeBetween('Start_Time', '+2 hours')->format('H:i:s'), // Generate end time within 2 hours from start time
        ];
}
}