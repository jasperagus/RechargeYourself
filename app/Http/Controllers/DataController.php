<?php

namespace App\Http\Controllers;

use App\Models\Data;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function index()
    {
        $data = Data::paginate(5); // Ensure the variable name is $data
        return view('index', compact('data')); // Pass the variable to the view
    }

    public function exportExcel()
{
    $filename = "Data.xlsx"; // Change the file extension to .xlsx for Excel

    $headers = [
        "Content-type" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel MIME type
        "Content-Disposition" => "attachment; filename=\"$filename\"",
        "Pragma" => "no-cache",
        "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
        "Expires" => "0"
    ];

    return response()->stream(function() {
        $handle = fopen('php://output', 'w');

        // Add Excel headers
        $excelHeader = [
            'Song Number',
            'Date',
            'Start Time',
            'End Time',
        ];

        fputcsv($handle, $excelHeader, "\t"); // Use tab as delimiter for Excel

        // Fetch and process data in chunks
        Data::chunk(1000, function($data) use($handle) {
            foreach ($data as $d) {
                // Adjust data format for Excel if needed
                $excelData = [
                    $d->Song_Number,
                    $d->Date,
                    $d->Start_Time,
                    $d->End_Time,
                ];
                fputcsv($handle, $excelData, "\t"); // Use tab as delimiter for Excel
            }
        });

        fclose($handle);
    }, 200, $headers);
}

    public function exportCSV()
    {
        $filename = "Data.csv";

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=\"$filename\"",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        return response()->stream(function() {
            $handle = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($handle, [
                'Song_Number',
                'Date',
                'Start_Time',
                'End_Time',
            ]);

            // Fetch and process data in chunks
            Data::chunk(1000, function($data) use($handle) {
                foreach ($data as $d) {
                    fputcsv($handle, [
                        $d->Song_Number,
                        $d->Date,
                        $d->Start_Time,
                        $d->End_Time,
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
}