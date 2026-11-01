<?php

$dir = new RecursiveDirectoryIterator(__DIR__ . '/app/Filament/Resources');
$iterator = new RecursiveIteratorIterator($dir);
$phpFiles = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);

$count = 0;
foreach ($phpFiles as $file) {
    $filePath = $file[0];
    $content = file_get_contents($filePath);
    $changed = false;

    // Patch recordActions
    if (preg_match('/->recordActions\(\[.*?\]\)/s', $content)) {
        $replacement = "->recordActions([\n" .
                       "                \Filament\Tables\Actions\ViewAction::make(),\n" .
                       "                \Filament\Tables\Actions\EditAction::make(),\n" .
                       "                \Filament\Tables\Actions\DeleteAction::make(),\n" .
                       "            ])";
        $content = preg_replace('/->recordActions\(\[.*?\]\)/s', $replacement, $content);
        $changed = true;
    }

    // Patch ->actions([...]) in RelationManagers or other places that are not using recordActions
    // Need to make sure we only patch inside table() method, or just look for ->actions([
    // But we must be careful not to replace form actions. Usually tables use ->actions([
    if (strpos($filePath, 'RelationManager.php') !== false) {
        if (preg_match('/->actions\(\[.*?\]\)/s', $content)) {
            $replacement = "->actions([\n" .
                           "                \Filament\Tables\Actions\ViewAction::make(),\n" .
                           "                \Filament\Tables\Actions\EditAction::make(),\n" .
                           "                \Filament\Tables\Actions\DeleteAction::make(),\n" .
                           "            ])";
            $content = preg_replace('/->actions\(\[.*?\]\)/s', $replacement, $content);
            $changed = true;
        }
    }

    if ($changed) {
        // Also ensure necessary imports exist (or just use fully qualified names as we did above)
        file_put_contents($filePath, $content);
        $count++;
        echo "Patched: " . basename($filePath) . "\n";
    }
}

echo "Total files patched: $count\n";
