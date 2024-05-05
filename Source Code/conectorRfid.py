import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import serial
import pyperclip
import pyautogui
import time
from serial.tools import list_ports


def leer_desde_arduino(puerto_serie, baudios):
    ser = serial.Serial(puerto_serie, baudios, timeout=1)
    try:
        while True:
            linea = ser.readline().decode('utf-8').strip()
            while not linea:
                linea = ser.readline().decode('utf-8').strip()
            pyperclip.copy(linea)
            pyautogui.hotkey('ctrl', 'v')
            time.sleep(2)
    except KeyboardInterrupt:
        print("Programa detenido por el usuario.")
    finally:
        ser.close()


def detectar_arduino():
    puertos_disponibles = [port.device for port in list_ports.comports()]
    for puerto in puertos_disponibles:
        try:
            ser = serial.Serial(puerto, 9600, timeout=1)
            ser.close()
            return puerto
        except serial.SerialException:
            continue
    return None


def iniciar_lectura():
    puerto = detectar_arduino()
    if puerto:
        try:
            ser = serial.Serial(puerto, 9600, timeout=1)
            ser.close()
            messagebox.showinfo("Estado de la conexión",
                                "Conectado correctamente al puerto " + puerto)
            time.sleep(2)  # Espera 2 segundos
            leer_desde_arduino(puerto, 9600)
        except Exception as e:
            messagebox.showinfo("Estado de la conexión",
                                "Error al conectarse al puerto " + puerto)
    else:
        messagebox.showinfo("Estado de la conexión",
                            "No se pudo detectar el Arduino.")


app = tk.Tk()
app.title("SIASA - MODULO LECTOR RFID")
app.iconbitmap("icon.ico")

# Centrar interfaz en cualquier monitor
# Definir el ancho y alto de la ventana
window_width = 350  # Ancho
window_height = 80  # Alto

# Obtener el ancho y alto de la pantalla para poder centrarla
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

# Calcular las coordenadas x e y de la pantalla o monitor que se está usando para centrar la ventana
x = (screen_width // 2) - (window_width // 2)
y = (screen_height // 2) - (window_height // 2)

# Establecer la geometría de la ventana para centrarla
app.geometry("%dx%d+%d+%d" % (window_width, window_height, x, y))

boton_detectar = tk.Button(app, text="Detectar Arduino", command=iniciar_lectura)
boton_detectar.pack()

estado_label = tk.Label(app, text="")
estado_label.pack()

app.mainloop()
