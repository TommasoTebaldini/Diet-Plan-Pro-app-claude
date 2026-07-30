// Bluetooth smart scale support via the Web Bluetooth API and the standard
// Bluetooth SIG "Weight Scale Service" (GATT, spec WSS v1.0.1).
//
// Coverage is intentionally limited to scales that implement this STANDARD
// profile (common on many pharmacy/medical-grade BLE scales). Several popular
// consumer scales (e.g. Xiaomi Mi Body Scale) use a proprietary GATT service
// instead of the standard one and are NOT readable through this path — there
// is no way to support them without reverse-engineering each vendor's
// protocol individually. Nothing here silently claims broader compatibility
// than this.
//
// Web Bluetooth itself is unsupported on iOS/iPadOS (any browser, including
// Capacitor's WKWebView) and on desktop Safari — isBleScaleSupported() below
// reflects that as a plain runtime capability check, no platform sniffing.

const WEIGHT_SCALE_SERVICE = 0x181d;
const WEIGHT_MEASUREMENT_CHAR = 0x2a9d;

export function isBleScaleSupported() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

// Bluetooth SIG WSS v1.0.1 Weight Measurement characteristic layout:
//   byte 0        — flags (bit0: units, bit1: timestamp present, bit2: user id
//                    present, bit3: BMI/height present, bits4-6/7-9: resolution)
//   bytes 1-2 (LE) — weight, uint16, resolution 0.005 kg (SI) or 0.01 lb (imperial)
//   ...optional timestamp / user id / BMI+height fields follow, unused here
function parseWeightMeasurement(dataView) {
  const flags = dataView.getUint8(0);
  const imperial = (flags & 0x01) === 1;
  const raw = dataView.getUint16(1, /* littleEndian */ true);
  if (raw === 0xffff) return null; // "measurement unsuccessful" sentinel
  const kg = imperial ? (raw * 0.01) * 0.453592 : raw * 0.005;
  return Math.round(kg * 10) / 10;
}

// Prompts the OS Bluetooth device picker (must be called from a user gesture,
// e.g. a button onClick — the browser rejects requestDevice() otherwise),
// connects, reads one weight sample, then disconnects. Resolves the weight
// in kg, or rejects if the user cancels / the device doesn't expose the
// standard service / no reading arrives within the timeout.
export async function connectAndReadWeight({ timeoutMs = 20000 } = {}) {
  if (!isBleScaleSupported()) {
    throw new Error('Il Bluetooth web non è supportato su questo browser/dispositivo.');
  }

  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [WEIGHT_SCALE_SERVICE] }],
  });

  const server = await device.gatt.connect();
  try {
    const service = await server.getPrimaryService(WEIGHT_SCALE_SERVICE);
    const characteristic = await service.getCharacteristic(WEIGHT_MEASUREMENT_CHAR);

    const weight = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        characteristic.removeEventListener('characteristicvaluechanged', onValue);
        reject(new Error('Nessuna misurazione ricevuta — sali sulla bilancia e riprova.'));
      }, timeoutMs);

      function onValue(event) {
        const kg = parseWeightMeasurement(event.target.value);
        if (kg == null) return; // sentinel/unsuccessful sample, keep waiting
        clearTimeout(timer);
        characteristic.removeEventListener('characteristicvaluechanged', onValue);
        resolve(kg);
      }

      characteristic.addEventListener('characteristicvaluechanged', onValue);
      characteristic.startNotifications().catch(err => {
        clearTimeout(timer);
        characteristic.removeEventListener('characteristicvaluechanged', onValue);
        reject(err);
      });
    });

    return weight;
  } finally {
    try { server.disconnect(); } catch { /* already disconnected */ }
  }
}
