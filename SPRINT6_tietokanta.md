# Sprintti 6: Tietokantasuunnitelma palvelua varten

## 1. Tietokantamalli

Projektin tietokantaan kuuluu kolme taulua: **users**, **tasks** ja **categories**. Näin toteutetaan vaadittu vähintään kolmen taulun rakenne ja mahdollistetaan selkeä relaatiomalli.

### Taulut ja niiden kentät

#### users
| Sarake      | Tyyppi     | Kuvaus                           |
|-------------|------------|----------------------------------|
| id          | INTEGER PK | Yksilöllinen käyttäjän id        |
| username    | TEXT       | Käyttäjänimi, uniikki            |
| password_hash | TEXT     | Salattu salasana                 |
| email       | TEXT       | Sähköposti (valinnainen)         |
| created_at  | DATETIME   | Luontiaika                       |

#### categories
| Sarake   | Tyyppi     | Kuvaus                       |
|----------|------------|------------------------------|
| id       | INTEGER PK | Kategorian id                |
| name     | TEXT       | Kategorian nimi              |

#### tasks
| Sarake      | Tyyppi     | Kuvaus                                     |
|-------------|------------|--------------------------------------------|
| id          | INTEGER PK | Tehtävän id                                |
| user_id     | INTEGER FK | Viittaus käyttäjään (users.id)             |
| title       | TEXT       | Tehtävän otsikko                           |
| description | TEXT       | Tehtävän kuvaus                            |
| is_completed| INTEGER    | 0 = kesken, 1 = valmis                     |
| due_date    | DATE       | Eräpäivä (valinnainen)                     |
| created_at  | DATETIME   | Tehtävän luontiaika                        |
| category_id | INTEGER FK | Viittaus kategoriaan (categories.id)       |

## 2. Relaatiot

- **tasks.user_id** viittaa **users.id** (yksi käyttäjä, monta tehtävää)
- **tasks.category_id** viittaa **categories.id** (yksi kategoria, monta tehtävää)

## 3. SQL-luontilauseet

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_completed INTEGER DEFAULT 0,
    due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    category_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);
```

## 4. CRUD-toiminnot

### Käyttäjät (users)
- Luo uusi käyttäjä (Create)
- Hae käyttäjän tiedot (Read)
- Päivitä käyttäjän tietoja (Update)
- Poista käyttäjä (Delete)

### Tehtävät (tasks)
- Lisää uusi tehtävä (Create)
- Listaa tehtävät (Read)
- Muokkaa tehtävää (Update)
- Poista tehtävä (Delete)

### Kategoriat (categories)
- Luo uusi kategoria (Create)
- Listaa kategoriat (Read)
- Muokkaa kategoriaa (Update)
- Poista kategoria (Delete)

## 5. Esimerkkikyselyt tehtäville

```sql
-- Luo tehtävä
INSERT INTO tasks (user_id, title, description, category_id) VALUES (1, 'Opiskele SQL', 'Katso SQL-tietokantojen perusteet', 2);

-- Listaa käyttäjän tehtävät
SELECT * FROM tasks WHERE user_id = 1;

-- Päivitä tehtävä valmiiksi
UPDATE tasks SET is_completed = 1 WHERE id = 3 AND user_id = 1;

-- Poista tehtävä
DELETE FROM tasks WHERE id = 3 AND user_id = 1;
```

---

**Tämä tietokantamalli täyttää vaatimukset ja mahdollistaa laajennettavan ja selkeän Task Manager -sovelluksen toteutuksen.**