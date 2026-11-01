<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Credential;

class CredentialController extends Controller
{
    public function index()
    {
        $credentials = Credential::all(['id', 'title', 'description', 'icon']);
        return response()->json($credentials);
    }
}
