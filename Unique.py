import uuid
import subprocess
import platform
import sys
import os
from flask import Flask, send_from_directory
import webbrowser

# Создание Flask приложения
app = Flask(__name__)

@app.route('/')
def serve_index():
    return send_from_directory('./Mainwall', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('./Mainwall', filename)

# Получение UUID системы
def get_system_uuid():
    try:
        system = platform.system()

        if system == 'Windows':  # Windows
            result = subprocess.run(['wmic', 'csproduct', 'get', 'UUID'], capture_output=True, text=True)
            uuid_str = result.stdout.splitlines()[1].strip()
        elif system == 'Linux':  # Linux
            result = subprocess.run(['sudo', 'dmidecode', '-s', 'system-uuid'], capture_output=True, text=True)
            uuid_str = result.stdout.strip()
        elif system == 'Darwin':  # macOS
            result = subprocess.run(['ioreg', '-rd1', '-c', 'IOPlatformExpertDevice'], capture_output=True, text=True)
            for line in result.stdout.splitlines():
                if "IOPlatformUUID" in line:
                    uuid_str = line.split('=')[-1].strip().replace('"', '')
                    return uuid_str
        elif system == 'FreeBSD':  # FreeBSD
            result = subprocess.run(['kenv', 'smbios.system.uuid'], capture_output=True, text=True)
            uuid_str = result.stdout.strip()
        else:
            uuid_str = "Unsupported OS"
        return uuid_str
    except Exception as e:
        return f"Error retrieving system UUID: {e}"

# Открытие системного браузера в полноэкранном режиме
def open_browser_fullscreen(browser='chrome'):
    system = platform.system()
    
    url = 'http://localhost:5005/'
    
    if browser == 'firefox':
        if system == 'Windows':
            subprocess.run(['start', 'firefox', '--kiosk', url], shell=True)
        elif system == 'Linux':
            subprocess.run(['firefox', '--kiosk', url])
        elif system == 'Darwin':  # macOS
            subprocess.run(['open', '-a', 'Firefox', '--args', '--kiosk', url])
    else:  # Default to Chrome
        if system == 'Windows':
            subprocess.run(['start', 'chrome', '--kiosk', url], shell=True)
        elif system == 'Linux':
            subprocess.run(['google-chrome', '--kiosk', url])
        elif system == 'Darwin':  # macOS
            subprocess.run(['open', '-a', 'Google Chrome', '--args', '--kiosk', url])
        else:
            webbrowser.open(url)

# Функция для запуска сервера
def run_server():
    app.run(host='0.0.0.0', port=5005)

# Основной код
if __name__ == "__main__":
    # Запись UUID в файл
    uuid_value = get_system_uuid()
    with open('./Mainwall/uuid.txt', 'w') as uuidf:
        uuidf.write(uuid_value)

    # Запуск сервера
    from threading import Thread
    server_thread = Thread(target=run_server)
    server_thread.setDaemon(True)
    server_thread.start()

    # Открытие браузера в полноэкранном режиме (firefox или chrome)
    open_browser_fullscreen(browser='firefox')
