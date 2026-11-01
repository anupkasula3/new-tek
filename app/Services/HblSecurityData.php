<?php

namespace App\Services;

class HblSecurityData
{
    // demo: 7664a2ed0dee4879bdfca0e8ce1ac313
    // production: 19f84b5655f04e25a99b09f1ee2fac78
    public static string $EncryptionKeyId = '19f84b5655f04e25a99b09f1ee2fac78';
    public static string $TokenType = "JWT";
    public static string $JWSAlgorithm = "PS256";
    public static string $JWEAlgorithm = "RSA-OAEP";
    public static string $JWEEncrptionAlgorithm = "A128CBC-HS256";

    public static function getEncryptionKeyId(): string
    {
        return env('HBL_ENCRYPTION_KEY_ID', '19f84b5655f04e25a99b09f1ee2fac78');
    }

    public static function getAccessToken(): string
    {
        return env('HBL_API_KEY', '50c30f989d7148e4b70516920b5862d2');
    }

    public static function getApiKey(): string
    {
        return env('HBL_API_KEY', '50c30f989d7148e4b70516920b5862d2');
    }

    /**
     * Merchant Signing Private Key (PKCS#8) — used to sign the request JWS.
     * Source: him/src/SecurityData.php -> $MerchantSigningPrivateKey
     */
    public static function getMerchantSigningPrivateKey(): string
    {
        if ($key = env('HBL_MERCHANT_SIGNING_PRIVATE_KEY')) {
            return $key;
        }
        return "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";
    }

    /**
     * PACO Encryption Public Key — used to encrypt the request JWE.
     * Source: him/src/SecurityData.php -> $PacoEncryptionPublicKey
     */
    public static function getPacoEncryptionPublicKey(): string
    {
        if ($key = env('HBL_PACO_ENCRYPTION_PUBLIC_KEY')) {
            return $key;
        }
        return "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6ZLups2K0iYEMxQqgASX8gY6tWhNVCp08YuDgjCsOVrGVgUHD0dh0TWFNJ7Lq2Jp0SOsGgi54+hrjwPOL2CCZxw8pKUlL57UksoD9oWUrK/KkSvEAwPU4cZqzxIXyhBcZb8O96iN4WQJILkRTg+DXLkML6qisO496fPGIs+vCoc87toucy5O9fRfaYSjcqjreyi8JDkvVJM/BeNtOEM2a0b/lcWa67RH+tN97H25k+Qez7QthLru6oBfWBgD6iIwhV+ICqLWHmp6fQ+DHQk/o+OO3yFiY9OAvMiy8MOTinvkBlFwYgYNznG3/w0Xh8U5vtudUXPDNUO6ddf4y99+6LlWDiKgJn/Th93YUg+gFH4LUJHyPrSY2JuC+Q8kksp2xyiZDTHGzi96kturwrqCui6TytCHcU4UB0VRMR+M7VRl3S2YPhcxv5U8Fh2PITqydZE5vv1Va06qhegjOlSZnEUl2xKPm5k/u+UHvUP/oq04fQLTlYqyA3JYDCe4z5Ea2SOgjeVl+qTatWYzmkUXyCONLZ4UaRrgbYCp0nCPHoTFgRQdChu8ezDbnYY9IW7cT/s2fEi5N7X1XrQttiEP4rbn0y0qVYYjN86+elfhtYGHidZTUSUS5RSTHqOkj59p5LIGwFF9iTXzCjfUqq8clnfOk76qSLY1+Kj+SMMe6Z8CAwEAAQ==";
    }

    /**
     * PACO Signing Public Key — used to verify the response JWS signature.
     * Source: him/src/SecurityData.php -> $PacoSigningPublicKey
     */
    public static function getPacoSigningPublicKey(): string
    {
        if ($key = env('HBL_PACO_SIGNING_PUBLIC_KEY')) {
            return $key;
        }
        return "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAr0XW6QacR8GilY4nZrJZW40wnFeYu7h9aXUSqxCP6djurCWZmLqnrsYWP7/HR8WOulYPHTVpfqJesTOdVqPgY6p10H811oRbJG9jvsG8j8kn/Bk8b2wZ9qelNqdNJMDbR5WUyaytaDWW6QdI4+clqjFfwCOw76noDSe+R4pDSzgMiyCk5R4m2ECT1fv/4Axz2bvLN+DRTg5DPPIMLWpA87lgjxeaDlGyJqZCbkJozW7JX0AJVc0X7YR9kzbiTi3LVOInSKY+VHT8yCARIdvXtKc6+IWSbVQqgpNIBB8GN0OvU8xedjPNCMGZnnMtgd7XLTf/okyadbdNLAqQLTbDs/5HnIVx8FyfgiOS/zsim5ivi3ljVAW3T3ePGjkY0q1DMzr5iJ4m/WTL2d1TArlfHyQhkSpFpQPOO+pJyVQqttHJo99vMirQogdSx4lIu//aod0yJyJLpjCeiqb2Fz3Qk0AZ4S78QKeeGsxTRchTP6Wsb6okaZd+cFi6z8qbP0z/Y3xRZO7vOLB/whkqS+pMVKBQ42YzgQPRzbXXmgCkf1nCqgrD9bnIB5ovdRGfDXW86GKY8XwGVjb4BoMvql+HsbonKHAO+eGfQulpB5YfQGQU3ZXdMdfCLAk8FuqemH4k7S7diLzVvRCuisHsEx6qJ4ewxzNCvW7OGVinTR9NSQUCAwEAAQ==";
    }

    /**
     * Merchant Decryption Private Key (PKCS#8) — used to decrypt the response JWE.
     * Source: him/src/SecurityData.php -> $MerchantDecryptionPrivateKey
     */
    public static function getMerchantDecryptionPrivateKey(): string
    {
        if ($key = env('HBL_MERCHANT_DECRYPTION_PRIVATE_KEY')) {
            return $key;
        }
        return "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";
    }
}
