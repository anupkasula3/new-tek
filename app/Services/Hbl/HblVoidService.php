<?php

namespace App\Services\Hbl;

use App\Services\HblPaymentService;
use App\Services\HblSecurityData;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;

/**
 * HBL / 2C2P Void Request Service
 *
 * Ported from: intregation/hbldemo/src/api/VoidRequest.php
 */
class HblVoidService extends HblPaymentService
{
    /**
     * Void / cancel a payment (plain JSON, no JOSE).
     *
     * @throws GuzzleException
     */
    public function execute(
        string $officeId,
        string $orderNo,
        string $productDescription,
        string $issuerApprovalCode,
        float  $amount,
        string $currencyCode,
        string $actionBy = 'System'
    ): string {
        $amountText = str_pad(round($amount * 100), 12, '0', STR_PAD_LEFT);

        $request = [
            "officeId"           => $officeId,
            "orderNo"            => $orderNo,
            "productDescription" => $productDescription,
            "issuerApprovalCode" => $issuerApprovalCode,
            "actionBy"           => $actionBy,
            "voidAmount"         => [
                "amountText"    => $amountText,
                "currencyCode"  => $currencyCode,
                "decimalPlaces" => 2,
                "amount"        => $amount,
            ],
        ];

        $response = $this->client->post('api/1.0/Void', [
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
     * Void / cancel a payment using JOSE (signed + encrypted).
     *
     * @throws GuzzleException
     * @throws \Exception
     */
    public function executeJose(
        string $officeId,
        string $orderNo,
        string $productDescription,
        string $issuerApprovalCode,
        float  $amount,
        string $currencyCode,
        string $actionBy = 'System'
    ): string {
        $now        = Carbon::now();
        $amountText = str_pad(round($amount * 100), 12, '0', STR_PAD_LEFT);

        $request = [
            "officeId"           => $officeId,
            "orderNo"            => $orderNo,
            "productDescription" => $productDescription,
            "issuerApprovalCode" => $issuerApprovalCode,
            "actionBy"           => $actionBy,
            "voidAmount"         => [
                "amountText"    => $amountText,
                "currencyCode"  => $currencyCode,
                "decimalPlaces" => 2,
                "amount"        => $amount,
            ],
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

        $response = $this->client->post('api/1.0/Void', [
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
