<?php
$dir = __DIR__ . '/app/Models';
$files = scandir($dir);

foreach ($files as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
        $content = file_get_contents($dir . '/' . $file);
        
        // Add guarded if it doesn't exist
        if (strpos($content, '$guarded') === false) {
            $content = preg_replace('/(class\s+[A-Za-z0-9_]+\s+extends\s+Model\s*\{)/', "$1\n    protected \$guarded = [];\n", $content);
            file_put_contents($dir . '/' . $file, $content);
            echo "Added guarded to " . $file . "\n";
        }
    }
}
