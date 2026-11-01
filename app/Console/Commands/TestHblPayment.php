<?php

namespace App\Console\Commands;

use App\Services\HblPaymentService;
use App\Services\HblSecurityData;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use Illuminate\Console\Command;
use Psr\Http\Message\RequestInterface;

class TestHblPayment extends Command
{
    protected $signature   = 'hbl:test {--amount=10.00} {--currency=USD}';
    protected $description = 'Test the HBL payment gateway and print raw request/response.';

    public function handle(): void
    {
        $amount   = (float) $this->option('amount');
        $currency = $this->option('currency');

        $this->line('');
        $this->info('═══════════════════════════════════════════════');
        $this->info('  HBL PAYMENT GATEWAY — CONNECTION TEST');
        $this->info('═══════════════════════════════════════════════');
        $this->line('');

        // ── Credentials ─────────────────────────────────────
        $mid    = env('HBL_MERCHANT_ID');
        $apiKey = env('HBL_API_KEY');
        $endpoint = env('HBL_ENDPOINT', 'https://core.demo-paco.2c2p.com/');

        $this->table(['Key', 'Value'], [
            ['HBL_MERCHANT_ID', $mid ?? '(not set)'],
            ['HBL_API_KEY',     $apiKey ?? '(not set)'],
            ['HBL_ENDPOINT',   $endpoint],
            ['Amount',         $amount . ' ' . $currency],
        ]);
        $this->line('');

        // ── Build Request Payload ────────────────────────────
        $service = new HblPaymentService();
        $now     = Carbon::now();
        $orderNo = 'TEST-' . $now->getPreciseTimestamp(3);
        $baseUrl = url('/');

        $currencyCode = $currency;

        $requestPayload = [
            "apiRequest" => [
                "requestMessageID" => $this->guid(),
                "requestDateTime"  => $now->utc()->format('Y-m-d\TH:i:s.v\Z'),
                "language"         => "en-US",
            ],
            "officeId"           => $mid,
            "orderNo"            => $orderNo,
            "productDescription" => "TEST Payment",
            "paymentType"        => "CC",
            "paymentCategory"    => "ECOM",
            "storeCardDetails"   => ["storeCardFlag" => "N", "storedCardUniqueID" => ""],
            "installmentPaymentDetails" => ["ippFlag" => "N", "installmentPeriod" => 0, "interestType" => null],
            "mcpFlag"            => "N",
            "request3dsFlag"     => "Y",
            "transactionAmount"  => [
                "amountText"    => str_pad(round($amount * 100), 12, "0", STR_PAD_LEFT),
                "currencyCode"  => $currencyCode,
                "decimalPlaces" => 2,
                "amount"        => number_format($amount, 2, '.', ''),
            ],
            "notificationURLs" => [
                "confirmationURL" => $baseUrl . '/payment/success?orderNo=' . $orderNo,
                "failedURL"       => $baseUrl . '/payment/failed?orderNo=' . $orderNo,
                "cancellationURL" => $baseUrl . '/payment/cancel?orderNo=' . $orderNo,
                "backendURL"      => $baseUrl . '/payment/backend?orderNo=' . $orderNo,
            ],
            "deviceDetails" => [
                "browserIp"         => "127.0.0.1",
                "browser"           => "Test CLI",
                "browserUserAgent"  => "PHP Artisan Test",
                "mobileDeviceFlag"  => "N",
            ],
        ];

        $jwtPayload = [
            "request"       => $requestPayload,
            "iss"           => $apiKey,
            "aud"           => "PacoAudience",
            "CompanyApiKey" => $apiKey,
            "iat"           => $now->unix(),
            "nbf"           => $now->unix(),
            "exp"           => $now->copy()->addHour()->unix(),
        ];

        $this->comment('▶ REQUEST PAYLOAD (plain JSON before encryption):');
        $this->line(json_encode($requestPayload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        $this->line('');

        // ── Encrypt & Send ────────────────────────────────────
        $this->comment('▶ Encrypting payload with merchant signing key + PACO public key…');

        try {
            $signingKey    = $service->testGetPrivateKey(HblSecurityData::getMerchantSigningPrivateKey());
            $encryptingKey = $service->testGetPublicKey(HblSecurityData::getPacoEncryptionPublicKey());
            $encryptedBody = $service->testEncryptPayload(json_encode($jwtPayload), $signingKey, $encryptingKey);

            $this->info('✔ Encryption successful. Token length: ' . strlen($encryptedBody) . ' chars');
            $this->line('');

            // Build HTTP client that logs the raw request
            $container = [];
            $history   = Middleware::history($container);
            $stack     = HandlerStack::create();
            $stack->push($history);
            $stack->push(Middleware::mapRequest(function (RequestInterface $req) {
                return $req->withoutHeader('User-Agent');
            }));

            $client = new Client([
                'base_uri' => $endpoint,
                'handler'  => $stack,
                'http_errors' => false,   // Don't throw on 4xx/5xx
            ]);

            $this->comment('▶ Sending POST to: ' . $endpoint . 'api/1.0/Payment/prePaymentUi');
            $this->comment('   Headers: CompanyApiKey=' . substr($apiKey, 0, 8) . '…  Content-Type=application/jose');
            $this->line('');

            $response     = $client->post('api/1.0/Payment/prePaymentUi', [
                'headers' => [
                    'Accept'         => 'application/jose',
                    'CompanyApiKey'  => $apiKey,
                    'Content-Type'   => 'application/jose; charset=utf-8',
                ],
                'body' => $encryptedBody,
            ]);

            $statusCode   = $response->getStatusCode();
            $rawBody      = trim($response->getBody()->getContents());

            $this->line("HTTP Status: <options=bold>{$statusCode}</>");
            $this->line('');

            if (str_starts_with($rawBody, 'ey')) {
                $this->info('✔ Response looks like a JOSE token. Attempting to decrypt…');
                try {
                    $decryptingKey         = $service->testGetPrivateKey(HblSecurityData::getMerchantDecryptionPrivateKey());
                    $sigVerificationKey    = $service->testGetPublicKey(HblSecurityData::getPacoSigningPublicKey());
                    $decrypted             = $service->testDecryptToken($rawBody, $decryptingKey, $sigVerificationKey);
                    $decoded               = json_decode($decrypted, true);

                    $this->info('✔ DECRYPTED RESPONSE:');
                    $this->line(json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                    $this->line('');

                    if (isset($decoded['response']['Data']['paymentPage']['paymentPageURL'])) {
                        $url = $decoded['response']['Data']['paymentPage']['paymentPageURL'];
                        $this->info('🎉 SUCCESS! Payment Page URL:');
                        $this->line($url);
                    } elseif (isset($decoded['response']['ApiResponse']['ResponseDescription'])) {
                         $this->error('HBL Error: ' . $decoded['response']['ApiResponse']['ResponseDescription']);
                    }
                } catch (\Exception $de) {
                    $this->error('✘ Could not decrypt the response: ' . $de->getMessage());
                    $this->line('Raw response body prefix: ' . substr($rawBody, 0, 50) . '...');
                }
            } else {
                $this->warn('⚠ Response is not a JOSE token.');
                $this->line('Raw response body:');
                $this->line($rawBody);
            }
        } catch (\Exception $e) {
            $this->error('✘ Exception: ' . $e->getMessage());
        }

        $this->line('');
        $this->info('═══════════════════════════════════════════════');
        $this->info('  TEST COMPLETE');
        $this->info('═══════════════════════════════════════════════');
        $this->line('');
    }

    private function guid(): string
    {
        $c = strtoupper(md5(uniqid(rand(), true)));
        return strtolower(substr($c,0,8).'-'.substr($c,8,4).'-'.substr($c,12,4).'-'.substr($c,16,4).'-'.substr($c,20,12));
    }
}
