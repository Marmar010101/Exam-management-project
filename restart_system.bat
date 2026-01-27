@echo off
echo "🧹 NETTOYAGE ET REDÉMARRAGE DU SYSTÈME"
echo "====================================="

echo "1. Arrêt du serveur Laravel..."
taskkill /F /IM php.exe 2>NUL
timeout /t 2 >NUL

echo "2. Nettoyage des caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "3. Nettoyage du cache navigateur (manuel)..."
echo "   Veuillez vider manuellement le cache de votre navigateur:"
echo "   - Chrome: Ctrl+Shift+Delete"
echo "   - Firefox: Ctrl+Shift+Delete"
echo "   - Edge: Ctrl+Shift+Delete"

echo "4. Redémarrage du serveur sur port 8001..."
php artisan serve --port=8001

echo "✅ Système redémarré!"
pause