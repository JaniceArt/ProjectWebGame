@echo off
echo ==================================================
echo DANG XUAT DU LIEU MAU...
echo ==================================================
C:\xampp\mysql\bin\mysqldump.exe -u root flappy_tabs > database.sql
echo XUAT DU LIEU THANH CONG! 
echo File database.sql da duoc cap nhat voi du lieu hien tai cua ban.
echo.
pause
