import http.client
import urllib.parse
import threading
import time
import os
import sys
from urllib.parse import urlparse

class Downloader:
    def __init__(self, url):
        self.url = url
        self.downloaded_bytes = 0
        self.is_downloading = False

    def print_progress(self):
        """Функция для периодического вывода прогресса"""
        while self.is_downloading:
            print(f"Скачано: {self.downloaded_bytes} байт")
            time.sleep(1)

    def download(self):
        """Основная функция скачивания"""
        # Разбираем URL на компоненты
        parsed_url = urlparse(self.url)

        # Получаем имя файла из URL
        filename = os.path.basename(parsed_url.path)
        if not filename:
            filename = 'downloaded_file'

        # Устанавливаем соединение
        if parsed_url.scheme == 'https':
            conn = http.client.HTTPSConnection(parsed_url.netloc)
        else:
            conn = http.client.HTTPConnection(parsed_url.netloc)

        try:
            # Отправляем GET запрос
            conn.request("GET", parsed_url.path)
            response = conn.getresponse()

            # Проверяем успешность запроса
            if response.status != 200:
                print(f"Ошибка: получен статус {response.status}")
                return

            # Открываем файл для записи
            with open(filename, 'wb') as file:
                self.is_downloading = True

                # Запускаем поток для вывода прогресса
                progress_thread = threading.Thread(target=self.print_progress)
                progress_thread.start()

                # Скачиваем файл блоками
                while True:
                    chunk = response.read(8192)  # Читаем блоками по 8KB
                    if not chunk:
                        break
                    file.write(chunk)
                    self.downloaded_bytes += len(chunk)

                # Завершаем скачивание
                self.is_downloading = False
                progress_thread.join()

            print(f"\nФайл {filename} успешно скачан ({self.downloaded_bytes} байт)")

        except Exception as e:
            print(f"Ошибка при скачивании: {e}")
        finally:
            conn.close()

def main():
    # Проверяем наличие аргумента URL
    if len(sys.argv) != 2:
        print("Использование: python script.py <URL>")
        return

    url = sys.argv[1]
    downloader = Downloader(url)
    downloader.download()

if __name__ == "__main__":
    main()