<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LegalDocument;

class LegalDocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            [
                "title" => "Tourism Business License",
                "issuer" => "Nepal Tourism Board",
                "license_no" => "NTB-2024-1234",
                "valid_until" => "December 2025",
            ],
            [
                "title" => "Trekking Agency Registration",
                "issuer" => "Ministry of Tourism",
                "license_no" => "TAAN-567890",
                "valid_until" => "December 2025",
            ],
            [
                "title" => "Environmental Compliance Certificate",
                "issuer" => "Department of National Parks",
                "license_no" => "DNPWC-2024-456",
                "valid_until" => "December 2025",
            ],
            [
                "title" => "Safety & Insurance Certificate",
                "issuer" => "Nepal Insurance Authority",
                "license_no" => "NIA-2024-789",
                "valid_until" => "December 2025",
            ],
        ];

        foreach ($documents as $doc) {
            LegalDocument::updateOrCreate(['title' => $doc['title']], $doc);
        }
    }
}
