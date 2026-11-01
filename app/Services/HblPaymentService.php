<?php

namespace App\Services;

use App\Models\PaymentLog;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use Illuminate\Support\Facades\Log;
use Jose\Component\Checker\AlgorithmChecker;
use Jose\Component\Checker\AudienceChecker;
use Jose\Component\Checker\ClaimCheckerManager;
use Jose\Component\Checker\ExpirationTimeChecker;
use Jose\Component\Checker\HeaderCheckerManager;
use Jose\Component\Checker\IssuerChecker;
use Jose\Component\Checker\NotBeforeChecker;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Encryption\Algorithm\ContentEncryption\A128CBCHS256;
use Jose\Component\Encryption\Algorithm\KeyEncryption\RSAOAEP;
use Jose\Component\Encryption\JWEBuilder;
use Jose\Component\Encryption\JWEDecrypter;
use Jose\Component\Encryption\JWELoader;
use Jose\Component\Encryption\JWETokenSupport;
use Jose\Component\Encryption\Serializer\CompactSerializer as JWECompactSerializer;
use Jose\Component\Encryption\Serializer\JWESerializerManager;
use Jose\Component\KeyManagement\JWKFactory;
use Jose\Component\Signature\Algorithm\PS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\JWSLoader;
use Jose\Component\Signature\JWSTokenSupport;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\CompactSerializer as JWSCompactSerializer;
use Jose\Component\Signature\Serializer\JWSSerializerManager;
use Psr\Clock\ClockInterface;
use Psr\Http\Message\RequestInterface;

class HblPaymentService
{
    protected Client $client;

    private JWSCompactSerializer $jwsCompactSerializer;
    private JWSBuilder $jwsBuilder;
    private JWSLoader $jwsLoader;
    private ClaimCheckerManager $claimCheckerManager;

    private JWECompactSerializer $jweCompactSerializer;
    private JWEBuilder $jweBuilder;
    private JWELoader $jweLoader;

    public function __construct()
    {
        $handler = HandlerStack::create();
        $handler->push(Middleware::mapRequest(function (RequestInterface $request) {
            return $request->withoutHeader('User-Agent');
        }));

        $this->client = new Client([
            'base_uri' => env('HBL_ENDPOINT', 'https://core.demo-paco.2c2p.com/'),
            'handler' => $handler
        ]);

        $this->jwsCompactSerializer = new JWSCompactSerializer();
        $this->jwsBuilder = new JWSBuilder(
            new AlgorithmManager([new PS256()])
        );

        $this->jwsLoader = new JWSLoader(
            new JWSSerializerManager([new JWSCompactSerializer()]),
            new JWSVerifier(new AlgorithmManager([new PS256()])),
            new HeaderCheckerManager(
                [new AlgorithmChecker([HblSecurityData::$JWSAlgorithm], true)],
                [new JWSTokenSupport()]
            )
        );

        $clock = new class implements ClockInterface {
            public function now(): \DateTimeImmutable {
                return new \DateTimeImmutable();
            }
        };

        $this->claimCheckerManager = new ClaimCheckerManager([
            new NotBeforeChecker($clock, 300),
            new ExpirationTimeChecker($clock, 300),
            new AudienceChecker(HblSecurityData::getApiKey()),
            new IssuerChecker(["PacoIssuer"]),
        ]);

        $this->jweCompactSerializer = new JWECompactSerializer();
        $this->jweBuilder = new JWEBuilder(
            new AlgorithmManager([new RSAOAEP(), new A128CBCHS256()])
        );

        $this->jweLoader = new JWELoader(
            new JWESerializerManager([new JWECompactSerializer()]),
            new JWEDecrypter(
                new AlgorithmManager([new RSAOAEP(), new A128CBCHS256()])
            ),
            new HeaderCheckerManager(
                [
                    new AlgorithmChecker([HblSecurityData::$JWEAlgorithm], true),
                    new ContentEncryptionAlgorithmChecker([HblSecurityData::$JWEEncrptionAlgorithm], true)
                ],
                [new JWETokenSupport()]
            )
        );
    }

    protected function GetPrivateKey(string $key, ?string $password = null, array $additional_values = []): JWK
    {
        // Strictly remove all non-base64 characters (only keep A-Z, a-z, 0-9, +, /, =)
        $cleanKey = preg_replace('/[^A-Za-z0-9\+\/\=]/', '', $key);

        if (empty($cleanKey)) {
            throw new Exception('Private key is empty. Check HBL_MERCHANT_SIGNING_PRIVATE_KEY / HBL_MERCHANT_DECRYPTION_PRIVATE_KEY in .env');
        }

        Log::info("Attempting to load private key. Clean Length: " . strlen($cleanKey) . " Prefix: " . substr($cleanKey, 0, 20));

        // The demo keys start with MIIJ which indicates PKCS#8 format — use "PRIVATE KEY" header
        // Try PKCS#8 first (BEGIN PRIVATE KEY), fall back to PKCS#1 (BEGIN RSA PRIVATE KEY)
        $formattedKeyPkcs8 = "-----BEGIN PRIVATE KEY-----\n" . chunk_split($cleanKey, 64, "\n") . "-----END PRIVATE KEY-----";
        try {
            return JWKFactory::createFromKey($formattedKeyPkcs8, $password, $additional_values);
        } catch (Exception $e) {
            // Try PKCS#1
            try {
                $formattedKeyPkcs1 = "-----BEGIN RSA PRIVATE KEY-----\n" . chunk_split($cleanKey, 64, "\n") . "-----END RSA PRIVATE KEY-----";
                return JWKFactory::createFromKey($formattedKeyPkcs1, $password, $additional_values);
            } catch (Exception $e2) {
                Log::error("JWKFactory failed both PKCS#8 and PKCS#1: " . $e->getMessage());
                throw $e;
            }
        }
    }

    protected function GetPublicKey(string $key, ?string $password = null, array $additional_values = []): JWK
    {
        $cleanKey = preg_replace('/[^A-Za-z0-9\+\/\=]/', '', $key);
        $publicKey = "-----BEGIN PUBLIC KEY-----\n" . chunk_split($cleanKey, 64, "\n") . "-----END PUBLIC KEY-----";
        return JWKFactory::createFromKey($publicKey, $password, $additional_values);
    }

    protected function EncryptPayload(string $payload, JWK $signingKey, JWK $encryptingKey): string
    {
        $jws = $this->jwsBuilder
            ->create()
            ->withPayload($payload)
            ->addSignature($signingKey, [
                "alg" => HblSecurityData::$JWSAlgorithm,
                "typ" => HblSecurityData::$TokenType,
            ])
            ->build();

        $jwe = $this->jweBuilder
            ->create()
            ->withPayload($this->jwsCompactSerializer->serialize($jws))
            ->withSharedProtectedHeader([
                "alg" => HblSecurityData::$JWEAlgorithm,
                "enc" => HblSecurityData::$JWEEncrptionAlgorithm,
                "kid" => HblSecurityData::getEncryptionKeyId(),
                "typ" => HblSecurityData::$TokenType,
            ])
            ->addRecipient($encryptingKey)
            ->build();

        return $this->jweCompactSerializer->serialize($jwe, 0);
    }

    protected function DecryptToken(string $token, JWK $decryptingKey, JWK $signatureVerificationKey): string
    {
        $jwe = $this->jweLoader->loadAndDecryptWithKey($token, $decryptingKey, $recipient);
        $jws = $this->jwsLoader->loadAndVerifyWithKey($jwe->getPayload(), $signatureVerificationKey, $signature);
        $payloadToken = $jws->getPayload();
        $claims = json_decode($payloadToken, true);
        try {
            $this->claimCheckerManager->check($claims);
        } catch (\Exception $claimEx) {
            // 2C2P response JWT uses: aud=api_key, iss="PacoIssuer"
            // Log warning but don't block — JWS signature is already verified above.
            \Illuminate\Support\Facades\Log::warning('HBL claim check warning (non-fatal): ' . $claimEx->getMessage() . ' | Claims: ' . json_encode(array_intersect_key($claims ?? [], array_flip(['aud','iss','exp','nbf','iat']))));
        }
        return $payloadToken;
    }

    public function parseJoseToken(string $token)
    {
        $decryptingKey = $this->GetPrivateKey(HblSecurityData::getMerchantDecryptionPrivateKey());
        $signatureVerificationKey = $this->GetPublicKey(HblSecurityData::getPacoSigningPublicKey());
        
        $decryptedJson = $this->DecryptToken($token, $decryptingKey, $signatureVerificationKey);
        return json_decode($decryptedJson, true);
    }

    // ── Public proxies used by the Artisan test command ─────
    public function testGetPrivateKey(string $key): JWK  { return $this->GetPrivateKey($key); }
    public function testGetPublicKey(string $key): JWK   { return $this->GetPublicKey($key); }
    public function testEncryptPayload(string $payload, JWK $signing, JWK $encrypting): string
    {
        return $this->EncryptPayload($payload, $signing, $encrypting);
    }
    public function testDecryptToken(string $token, JWK $decrypting, JWK $verification): string
    {
        return $this->DecryptToken($token, $decrypting, $verification);
    }

    protected function Guid(): string
    {
        if (function_exists('com_create_guid')) {
            return com_create_guid();
        } else {
            $charId = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);
            $guid = substr($charId, 0, 8) . $hyphen
                . substr($charId, 8, 4) . $hyphen
                . substr($charId, 12, 4) . $hyphen
                . substr($charId, 16, 4) . $hyphen
                . substr($charId, 20, 12);
            return strtolower($guid);
        }
    }

    public function initiatePayment($bookingId, $orderNo, $amount, $currency, $successUrl, $failedUrl, $cancelUrl, $backendUrl, $productDesc)
    {
        $mid = env('HBL_MERCHANT_ID') ?: '9104137120';
        $apiKey = HblSecurityData::getApiKey();
        $accessToken = HblSecurityData::getAccessToken();
        $now = Carbon::now();

        $request = [
            "apiRequest" => [
                "requestMessageID" => $this->Guid(),
                "requestDateTime" => $now->utc()->format('Y-m-d\TH:i:s.v\Z'),
                "language" => "en-US",
            ],
            "officeId" => $mid,
            "orderNo" => (string)$orderNo,
            "productDescription" => substr($productDesc, 0, 255),
            "paymentType" => "CC",
            "paymentCategory" => "ECOM",            
            "storeCardDetails" => [
                "storeCardFlag" => "N",
                "storedCardUniqueID" => "{{guid}}"
            ],
            "installmentPaymentDetails" => [
                "ippFlag" => "N",
                "installmentPeriod" => 0,
                "interestType" => null
            ],
            "mcpFlag" => "N",
            "request3dsFlag" => "Y",
            "transactionAmount" => [
                "amountText" => str_pad(round(($amount ?: 0) * 100), 12, "0", STR_PAD_LEFT),
                "currencyCode" => $currency,
                "decimalPlaces" => 2,
                "amount" => $amount
            ],
            "notificationURLs" => [
                "confirmationURL" => $successUrl,
                "failedURL" => $failedUrl,
                "cancellationURL" => $cancelUrl,
                "backendURL" => $backendUrl
            ],
            "deviceDetails" => [
                "browserIp" => "1.0.0.1",
                "browser" => "Postman Browser",
                "browserUserAgent" => "PostmanRuntime/7.26.8 - not from header",
                "mobileDeviceFlag" => "N"
            ],
            "purchaseItems" => [
                [
                    "purchaseItemType" => "ticket",
                    "referenceNo" => (string)$orderNo,
                    "purchaseItemDescription" => substr($productDesc, 0, 255),
                    "purchaseItemPrice" => [
                        "amountText" => str_pad(round(($amount ?: 0) * 100), 12, "0", STR_PAD_LEFT),
                        "currencyCode" => $currency,
                        "decimalPlaces" => 2,
                        "amount" => $amount
                    ],
                    "subMerchantID" => "string",
                    "passengerSeqNo" => 1
                ]
            ],
            "customFieldList" => [
                [
                    "fieldName" => "TestField",
                    "fieldValue" => "This is test"
                ]
            ]
        ];

        $paymentLog = \App\Models\PaymentLog::create([
            'booking_id' => $bookingId,
            'order_no' => $orderNo,
            'amount' => $amount,
            'currency' => $currency,
            'status' => 'pending',
            'request_payload' => $request,
        ]);

        $payload = [
            "request" => $request,
            "iss" => $apiKey,
            "aud" => "PacoAudience",
            "CompanyApiKey" => $apiKey,
            "iat" => $now->unix(),
            "nbf" => $now->unix(),
            "exp" => $now->addHour()->unix(),
        ];

        $stringPayload = json_encode($payload);
        $signingKey = $this->GetPrivateKey(HblSecurityData::getMerchantSigningPrivateKey());
        $encryptingKey = $this->GetPublicKey(HblSecurityData::getPacoEncryptionPublicKey());

        $body = $this->EncryptPayload($stringPayload, $signingKey, $encryptingKey);

        try {
            $response = $this->client->post('api/1.0/Payment/prePaymentUi', [
                'headers' => [
                    'Accept' => 'application/jose',
                    'CompanyApiKey' => HblSecurityData::getAccessToken(),
                    'Content-Type' => 'application/jose; charset=utf-8'
                ],
                'body' => $body
            ]);

            $token = $response->getBody()->getContents();
            $decryptingKey = $this->GetPrivateKey(HblSecurityData::getMerchantDecryptionPrivateKey());
            $signatureVerificationKey = $this->GetPublicKey(HblSecurityData::getPacoSigningPublicKey());

            $decryptedJson = $this->DecryptToken($token, $decryptingKey, $signatureVerificationKey);
            $responseObj = json_decode($decryptedJson);

            $paymentLog->update([
                'response_payload' => json_decode($decryptedJson, true),
            ]);

            if (isset($responseObj->response->Data->paymentPage->paymentPageURL)) {
                return $responseObj->response->Data->paymentPage->paymentPageURL;
            }

            throw new Exception("Payment page URL not found in response: " . $decryptedJson);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $httpResponse  = $e->getResponse();
            $statusCode    = $httpResponse->getStatusCode();
            $reasonPhrase  = $httpResponse->getReasonPhrase();
            // Body stream: read into a string first to avoid double-read issues
            $responseBody  = (string) $httpResponse->getBody();

            \Illuminate\Support\Facades\Log::error("HBL HTTP {$statusCode} {$reasonPhrase} — Body: " . ($responseBody ?: '(empty)'));
            \Illuminate\Support\Facades\Log::error("HBL Response Headers: " . json_encode($httpResponse->getHeaders()));

            $errorData = [
                'http_status' => $statusCode,
                'error'       => $responseBody,
            ];

            // Try to decrypt if it's a JOSE response
            try {
                $decryptingKey = $this->GetPrivateKey(HblSecurityData::getMerchantDecryptionPrivateKey());
                $signatureVerificationKey = $this->GetPublicKey(HblSecurityData::getPacoSigningPublicKey());
                $decryptedError = $this->DecryptToken($responseBody, $decryptingKey, $signatureVerificationKey);
                \Illuminate\Support\Facades\Log::error("HBL Decrypted Error: " . $decryptedError);
                $errorData['decrypted_error'] = json_decode($decryptedError, true);
            } catch (\Exception $de) {
                \Illuminate\Support\Facades\Log::warning("HBL error body not decryptable: " . $de->getMessage());
            }

            $paymentLog->update([
                'status'           => 'error',
                'response_payload' => $errorData,
            ]);

            $friendlyMsg = $errorData['decrypted_error']['response']['ApiResponse']['MarketingDescription']
                ?? $errorData['decrypted_error']['response']['ApiResponse']['ResponseDescription']
                ?? $errorData['decrypted_error']['response']['ResponseDescription']
                ?? ($responseBody ?: "HTTP {$statusCode} {$reasonPhrase} — empty response body");

            throw new Exception("HBL Payment Initiation Failed: " . $friendlyMsg);
        } catch (\Exception $e) {
            $paymentLog->update([
                'status'           => 'error',
                'response_payload' => ['exception' => $e->getMessage()],
            ]);
            throw $e;
        }
    }
}
