<?php

namespace App\Services;

use Jose\Component\Checker\HeaderChecker;
use Jose\Component\Checker\InvalidHeaderException;

class ContentEncryptionAlgorithmChecker implements HeaderChecker
{
    private array $supportedAlgorithms;
    private bool $protectedHeaderOnly;

    public function __construct(array $supportedAlgorithms, bool $protectedHeaderOnly = true)
    {
        $this->supportedAlgorithms = $supportedAlgorithms;
        $this->protectedHeaderOnly = $protectedHeaderOnly;
    }

    public function checkHeader(mixed $value): void
    {
        if (!is_string($value) || !in_array($value, $this->supportedAlgorithms, true)) {
            throw new InvalidHeaderException('Unsupported content encryption algorithm.', 'enc', $value);
        }
    }

    public function supportedHeader(): string
    {
        return 'enc';
    }

    public function protectedHeaderOnly(): bool
    {
        return $this->protectedHeaderOnly;
    }
}
