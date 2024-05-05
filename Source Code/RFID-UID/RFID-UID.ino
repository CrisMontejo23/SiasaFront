#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN         9           // Pin de reset
#define SS_PIN          10          // Pin de selección del esclavo (Slave Select)

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Crea el objeto MFRC522

void setup() {
  Serial.begin(9600);               // Inicia la comunicación serial
  SPI.begin();                      // Inicia la comunicación SPI
  mfrc522.PCD_Init();               // Inicia el lector RFID
}

void loop() {
  // Verifica si hay tarjetas presentes
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Imprime el UID en formato XX:XX:XX:XX
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) {
        Serial.print("0");
      }
      Serial.print(mfrc522.uid.uidByte[i], HEX);
      if (i < mfrc522.uid.size - 1) {
        Serial.print(":");
      }
    }
    Serial.println();

    // Espera un segundo antes de leer la siguiente tarjeta
    delay(1500);

    // Detiene la lectura de la tarjeta actual
    mfrc522.PICC_HaltA();
    // Reinicia el lector para la próxima detección
    mfrc522.PCD_Init();
  }
}
