<?php

namespace App\Services\Hbl;

use App\Services\HblPaymentService;
use App\Services\HblSecurityData;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;

/**
 * HBL / 2C2P Transaction Inquiry Service
 *
 * Ported from: intregation/hbldemo/src/api/Inquiry.php
 */
class HblInquiryService extends HblPaymentService
{
    /**
     * Inquire transaction by officeId and orderNo (plain JSON, no JOSE).
     *
     * @throws GuzzleException
     */
    public function execute(string $officeId, string $orderNo): string
    {
        $now = Carbon::now();

        $request = [
            "apiRequest" => [
                "requestMessageID" => $this->Guid(),
                "requestDateTime"  => $now->utc()->format('Y-m-d\TH:i:s.v\Z'),
                "language"         => "en-US",
            ],
            "advSearchParams" => [
                "controllerInternalID" => null,
                "officeId"             => [$officeId],
                "orderNo"              => [$orderNo],
                "invoiceNo2C2P"        => null,
                "fromDate"             => "0001-01-01T00:00:00",
                "toDate"               => "0001-01-01T00:00:00",
                "amountFrom"           => null,
                "amountTo"             => null,
            ],
        ];

        $response = $this->client->post('api/1.0/Inquiry/transactionList', [
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
     * Inquire transaction using JOSE (signed + encrypted).
     *
     * @throws GuzzleException
     * @throws \Exception
     */
    public function executeJose(string $officeId, string $orderNo): string
    {
        $now = Carbon::now();

        $request = [
            "apiRequest" => [
                "requestMessageID" => $this->Guid(),
                "requestDateTime"  => $now->utc()->format('Y-m-d\TH:i:s.v\Z'),
                "language"         => "en-US",
            ],
            "advSearchParams" => [
                "controllerInternalID" => null,
                "officeId"             => [$officeId],
                "orderNo"              => [$orderNo],
                "invoiceNo2C2P"        => null,
                "fromDate"             => "0001-01-01T00:00:00",
                "toDate"               => "0001-01-01T00:00:00",
                "amountFrom"           => null,
                "amountTo"             => null,
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

        $response = $this->client->post('api/1.0/Inquiry/transactionList', [
            'headers' => [
                'Accept'        => 'application/jose',
                'CompanyApiKey' => HblSecurityData::getAccessToken(),
                'Content-Type'  => 'application/jose; charset=utf-8',
            ],
            'body' => $body,
        ]);

        $token                   = $response->getBody()->getContents();
        $decryptingKey           = $this->GetPrivateKey(HblSecurityData::getMerchantDecryptionPrivateKey());
        $signatureVerificationKey = $this->GetPublicKey(HblSecurityData::getPacoSigningPublicKey());

        return $this->DecryptToken($token, $decryptingKey, $signatureVerificationKey);
    }
}
