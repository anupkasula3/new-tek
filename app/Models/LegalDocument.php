<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalDocument extends Model
{
    protected $fillable = [
        'title',
        'image',
        'issuer',
        'license_no',
        'valid_until',
        'document_file',
    ];
}
