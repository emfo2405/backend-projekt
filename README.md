## Moment 2 - Webbtjänster / API
Jag har skapat ett API för att kunna hantera behoven av ett café. Detta inkluderar registrering av anställda, inloggning för anställda, möjlighet
att skapa, visa och redigera en meny, möjlighet att skapa, visa och redigera bokningsförfrågningar och möjlighet att skapa, visa och redigera
meddelanden från kunder. API:et är skapat i syfte att kunna använda Create, Read, Update, Delete genom GET, POST, PUT och DELETE.

### Anslutning till API
API:et är publicerat på Render och har URL:en: https://backend-projekt-k6hc.onrender.com. Installationsvariabler för databasen finns även i .env.setup-filen där struktur för
variabler är satt. 

### Installera databas
För att komma igång med installationen av databasen klonas filerna ner och de paket som behövs för att köra koden installeras med npm install. Sedan är det första steget för att initiera databasen att köra install.js som skapar fyra tabeller som ser ut så här:
#### Tabell för användare
| Tabellnamn  | id | username | password | email | account_created| 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | 
| users  | SERIAL PRIMARY KEY  | VARCHAR(255) NOT NULL UNIQUE  | VARCHAR(255) NOT NULL  | VARCHAR(100) NOT NULL  | DATE DEFAULT CURRENT_TIMESTAMP  | 

#### Tabell för meny
| Tabellnamn  | id | drinkName | drinkType | price | description | allergens | item_created | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| menu  | SERIAL PRIMARY KEY  | VARCHAR(50) NOT NULL  | VARCHAR(50) NOT NULL  | INTEGER NOT NULL  | VARCHAR(255) NOT NULL  | VARCHAR(50) NOT NULL | DATE DEFAULT CURRENT_TIMESTAMP |

#### Tabell för bokningar
| Tabellnamn  | id | name | email | date | time | message | item_created | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| booking  | SERIAL PRIMARY KEY  | VARCHAR(50) NOT NULL  | VARCHAR(50) NOT NULL  | DATE NOT NULL  | TIME NOT NULL  | VARCHAR(200) | DATE DEFAULT CURRENT_TIMESTAMP |

#### Tabell för kundmeddelanden
| Tabellnamn  | id | name | email | message | item_created | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | 
| contact  | SERIAL PRIMARY KEY  | VARCHAR(50) NOT NULL  | VARCHAR(50) NOT NULL  | VARCHAR(200) | DATE DEFAULT CURRENT_TIMESTAMP |

### Hur man använder API:et 
Det finns olika sätt att använda API:et för att nå det, nedan finns en tabell över vilka metoder som kan användas och vad de innebär. 

| Metod  | Ändpunkt | Beskrivning | 
| ------------- | ------------- | ------------- |
| GET | /api | Kopplar upp till API |
| GET  | /booking  | Visar alla bokningar i databasen |
| GET  | /booking/:id  | Visar alla bokningar i databasen med ett specifikt id-nummer |
| POST  | /booking  | Lagrar en ny bokning i databasen. Ett objekt med korrekt information måste skickas med. |
| PUT  | /booking/:id  | Uppdaterar information för en bokning med ett specifikt id-nummer i databasen. Ett objekt med korrekt information måste skickas med. |
| DELETE  | /booking/:id  | Raderar en bokning ur databasen med ett specifikt id-nummer. |
| GET  | /contact  | Visar alla kundmeddelanden i databasen |
| GET  | /contact/:id  | Visar alla kundmeddelanden i databasen med ett specifikt id-nummer |
| POST  | /contact  | Lagrar ett nytt kundmeddelande i databasen. Ett objekt med korrekt information måste skickas med. |
| PUT  | /contact/:id  | Uppdaterar information för ett kundmeddelande med ett specifikt id-nummer i databasen. Ett objekt med korrekt information måste skickas med. |
| DELETE  | /contact/:id  | Raderar ett kundmeddelande ur databasen med ett specifikt id-nummer. |
| GET  | /menu  | Visar alla produkter i databasen |
| GET  | /menu/:id  | Visar alla produkter i databasen med ett specifikt id-nummer |
| POST  | /menu  | Lagrar en ny produkt i databasen. Ett objekt med korrekt information måste skickas med. |
| PUT  | /menu/:id  | Uppdaterar information för en produkt med ett specifikt id-nummer i databasen. Ett objekt med korrekt information måste skickas med. |
| DELETE  | /menu/:id  | Raderar en produkt ur databasen med ett specifikt id-nummer. |
| GET  | /register  | Visar alla användare i databasen |
| POST  | /register  | Lagrar en ny användare i databasen. Ett objekt med korrekt information måste skickas med. |
| POST  | /login  | Skapar en inloggning för en registrerad användare. Ett objekt med korrekt information måste skickas med. |
| GET  | /api/secret  | Hämtar hemligt innehåll ifall en användare är inloggad och har rätt token. |


#### Ett objekt som lägger till korrekt information om en bokning är uppbyggt så här:
```
{
  "name": "Namn",
  "email": "epost@epost.se",
  "date": "YYYY-MM-DD",
  "time": "hh:mm",
  "message": "Valfritt meddelande"
}
```

#### Ett objekt som lägger till korrekt information om en kundmeddelande är uppbyggt så här:
```
{
  "name": "Namn",
  "email": "epost@epost.se",
  "message": "Meddelande"
}
```

#### Ett objekt som lägger till korrekt information om en produkt till menyn är uppbyggt så här:
```
{
  "drinkName": "Espresso",
  "drinkType": "Varm kaffedryck",
  "price": "30",
  "description": "Två shots espresso",
  "allergens": "Inga"
}
```

#### Ett objekt som lägger till korrekt information om en ny användare är uppbyggt så här:
```
{
  "username": "Användarnamn123",
  "password": "Lösenord123",
  "email": "epost@epost.se"
}
```

#### Ett objekt som lägger till korrekt information om en inloggning är uppbyggt så här:
```
{
  "username": "Användarnamn123",
  "password": "Lösenord123"
}
```
