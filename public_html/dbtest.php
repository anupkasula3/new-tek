<?php

try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;port=3306;dbname=u121198727_trek",
        "u121198727_trek",
        "JeT@yr4+"
    );

    echo "WEB PHP DATABASE CONNECTED";
} catch (PDOException $e) {
    echo "WEB PHP ERROR: " . $e->getMessage();
}
