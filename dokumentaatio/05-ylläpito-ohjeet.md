# Ylläpito

## To do -sovelluksen ylläpito-ohjeet

### 1. Tehtävien hallinta

* **Tehtävien muokkaus:** Käyttäjät voivat lisätä, muokata, merkitä tehdyksi ja poistaa omia tehtäviään sovelluksen käyttöliittymässä.
* **Tietokannan varmistus:** Varmista säännöllisesti, että `database.sqlite`-tiedosto on tallessa ja siitä on varmuuskopio.

### 2. Käyttäjien hallinta

* **Käyttäjätunnukset:** Käyttäjät voivat rekisteröityä ja kirjautua itse. Tarvittaessa voit poistaa käyttäjiä suoraan tietokannasta (esim. SQLite-työkalulla).
* **Salasanojen turvallisuus:** Salasanat tallennetaan hashattuina, eikä niitä voi palauttaa näkyviin.

### 3. Sovelluksen päivitykset

* **Riippuvuudet:** Päivitä Node.js-paketit säännöllisesti komennolla `npm update`.
* **Tietoturva:** Seuraa Node.js:n ja käytettyjen npm-pakettien tietoturvapäivityksiä.
* **Sovelluksen päivitys:** Tee muutokset kehitysympäristössä ja testaa ennen tuotantoon vientiä.

### 4. Varmuuskopiot

* **Tietokanta:** Ota säännöllisesti varmuuskopio `database.sqlite`-tiedostosta.
* **Koodit:** Säilytä sovelluksen lähdekoodi versionhallinnassa (esim. GitHub).

### 5. Suorituskyky ja seuranta

* **Lokit:** Tarkista palvelimen lokitiedot mahdollisten virheiden varalta.
* **Suorituskyky:** Optimoi sovelluksen latausnopeus ja varmista, että palvelinresurssit riittävät käyttäjämäärälle.

### 6. Yleinen ylläpito

* **Päivitykset:** Pidä Node.js, npm ja kaikki riippuvuudet ajan tasalla.
* **Turvallisuus:** Käytä vahvoja salasanoja ja pidä palvelin suojattuna.
* **Käyttöohjeet:** Päivitä käyttö- ja ylläpito-ohjeita tarpeen mukaan.

---

**Muista:**

* **Dokumentaatio:** Hyödynnä projektin README.md-tiedostoa ja muita ohjeita.
* **Yhteisö:** Tarvittaessa kysy apua Node.js- ja SQLite-yhteisöiltä.
* **Varmuuskopiot:** Säännöllinen varmuuskopiointi on tärkeää tietojen säilyttämiseksi.

**Näillä ohjeilla varmistat, että to do -sovelluksesi pysyy toimivana
