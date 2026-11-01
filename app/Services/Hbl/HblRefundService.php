<?php

namespace App\Services\Hbl;

use App\Services\HblPaymentService;
use App\Services\HblSecurityData;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;

/**
 * HBL / 2C2P Refund Service
 *
 * Ported from: intregation/hbldemo/src/api/Refund.php
 */
class HblRefundService extends HblPaymentService
{
    /**
     * Issue a refund (plain JSON, no JOSE).
     *
     * @throws GuzzleException
     */
    public function execute(
        string $officeId,
        string $orderNo,
        float  $amount,
        string $currencyCode,
        string $actionBy   = 'System',
        string $actionEmail = ''
    ): string {
        $amountText = str_pad(round($amount * 100), 12, '0', STR_PAD_LEFT);

        $request = [
            "refundAmount" => [
                "AmountText"    => $amountText,
                "CurrencyCode"  => $currencyCode,
                "DecimalPlaces" => 2,
                "Amount"        => $amount,
            ],
            "refundItems"       => [],
            "localMakerChecker" => [
                "maker" => [
                    "username" => $actionBy,
                    "email"    => $actionEmail,
                ],
            ],
            "officeId" => $officeId,
            "orderNo"  => $orderNo,
        ];

        $response = $this->client->post('api/1.0/Refund/refund', [
            'headers' => [
                'Accept'       => 'application/json',
                'apiKey'       => HblSecurityData::getApiKey(),
                'Content-Type' => 'application/json; charset=utf-8',
            ],
            'body' => json_encode($request),
        ]);

        return $response->getBody()->getContents();
    }

    /**
     * Issue a refund using JOSE (signed + encrypted).
     *
     * @throws GuzzleException
     * @throws \Exception
     */
    public function executeJose(
        string $officeId,
        string $orderNo,
        float  $amount,
        string $currencyCode,
        string $actionBy   = 'System',
        string $actionEmail = ''
    ): string {
        $now        = Carbon::now();
        $amountText = str_pad(round($amount * 100), 12, '0', STR_PAD_LEFT);

        $request = [
            "refundAmount" => [
                "AmountText"    => $amountText,
                "CurrencyCode"  => $currencyCode,
                "DecimalPlaces" => 2,
                "Amount"        => $amount,
            ],
            "refundItems"       => [],
            "localMakerChecker" => [
                "maker" => [
                    "username" => $actionBy,
                    "email"    => $actionEmail,
                ],
            ],
            "officeId" => $officeId,
            "orderNo"  => $orderNo,
        ];

        $apiKey = HblSecurityData::getApiKey();

        $payload = [
            "request"       => $request,
            "iss"           => $apiKey,
            "aud"           => "PacoAudience",
            "CompanyApiKey" => $apiKey,
            "iat"           => $now->unix(),
            "nbf"           => $now->unix(),
            "exp"           => $now->copy()->addHour()->unix(),
        ];

        $signingKey    = $this->GetPrivateKey(HblSecurityData::getMerchantSigningPrivateKey());
        $encryptingKey = $this->GetPublicKey(HblSecurityData::getPacoEncryptionPublicKey());
        $body          = $this->EncryptPayload(json_encode($payload), $signingKey, $encryptingKey);

        $response = $this->client->post('api/1.0/Refund/refund', [
            'headers' => [
                'Accept'        => 'application/jose',
                'CompanyApiKey' => HblSecurityData::getAccessToken(),
                'Content-Type'  => 'application/jose; charset=utf-8',
            ],
            'body' => $body,
        ]);

        $token                    = $response->getBody()->getContents();
        $decryptingKey            = $this->GetPrivateKey(HblSecurityData::getMerchantDecryptionPrivateKey());
        $signatureVerificationKey = $this->GetPublicKey(HblSecurityData::getPacoSigningPublicKey());

        return $this->DecryptToken($token, $decryptingKey, $signatureVerificationKey);
    }
}
