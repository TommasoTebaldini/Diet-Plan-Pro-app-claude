# Firma delle build di release Android

Le build di release (per Google Play) vengono firmate con una **upload key**
locale, letta da `android/keystore.properties` (non committato — vedi
`.gitignore`). Senza quel file, `gradlew bundleRelease` produce una build
firmata col certificato di debug: si installa ma **non è caricabile su Play
Console**.

## File coinvolti (nessuno dei due è nel repo)

| File | Contenuto |
|---|---|
| `android/keystore/nutriplan-upload-key.jks` | Il keystore (chiave privata) |
| `android/keystore.properties` | Path del keystore + password + alias |

Sono già stati generati su questa macchina il 2026-09-03 (alias
`nutriplan-upload`, validità 30 anni). **Vanno salvati in backup** (password
manager o storage cifrato) fuori dal repo — se si perdono, non è più
possibile pubblicare aggiornamenti sotto lo stesso listing Play senza
passare dal reset della upload key lato Google (richiede verifica identità).

## Generare un nuovo keystore (se serve da capo, es. altra macchina)

```bash
keytool -genkeypair -v \
  -keystore android/keystore/nutriplan-upload-key.jks \
  -alias nutriplan-upload \
  -keyalg RSA -keysize 2048 -validity 10957 \
  -dname "CN=NutriPlan, OU=DietPlanPro, O=DietPlanPro, L=Italia, ST=Italia, C=IT"
```

Poi creare `android/keystore.properties`:

```properties
storeFile=../keystore/nutriplan-upload-key.jks
storePassword=<password scelta sopra>
keyAlias=nutriplan-upload
keyPassword=<stessa password: i keystore PKCS12 (default da Java 9+) ignorano una keyPassword diversa>
```

## Build

```bash
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease
# output: android/app/build/outputs/bundle/release/app-release.aab
```
