<?php

$dir = new RecursiveDirectoryIterator(__DIR__ . '/app/Filament/Resources');
$iterator = new RecursiveIteratorIterator($dir);
$phpFiles = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);

$count = 0;
foreach ($phpFiles as $file) {
    $filePath = $file[0];
    $content = file_get_contents($filePath);
    $changed = false;

    if (strpos($content, '\Filament\Tables\Actions\ViewAction') !== false) {
        $content = str_replace('\Filament\Tables\Actions\ViewAction', '\Filament\Actions\ViewAction', $content);
        $changed = true;
    }
    if (strpos($content, '\Filament\Tables\Actions\EditAction') !== false) {
        $content = str_replace('\Filament\Tables\Actions\EditAction', '\Filament\Actions\EditAction', $content);
        $changed = true;
    }
    if (strpos($content, '\Filament\Tables\Actions\DeleteAction') !== false) {
        $content = str_replace('\Filament\Tables\Actions\DeleteAction', '\Filament\Actions\DeleteAction', $content);
        $changed = true;
    }

    if ($changed) {
        file_put_contents($filePath, $content);
        $count++;
        echo "Patched: " . basename($filePath) . "\n";
    }
}

echo "Total files patched: $count\n";
