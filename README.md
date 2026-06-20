# Git clone, after that install dependencies:
1) [backend/local/start_resources.sh](backend/local/start_resources.sh)
2) For pre-commit initialization, please run command: _npx husky_

# BackEnd start
### Dependencies
* Maven 3, Java 16, Docker, MySQLV8

### Build
* application-local.yml file required for local run
* (recommended) run create db schema by sql commands in file (current file is data-structure.12.2024.sql)
* `mvn spring-boot:run -Dspring-boot.run.profiles=local -P local|prod`

### Api Keys 
google.geocodingapikey (needed for map functionality)
spring.security.oauth2.client.registration.google.client-id (oauth2)
spring.security.oauth2.client.registration.google.client-secret (oauth2)
spring.mail.username (needed for emailing)
spring.mail.password: (needed for emailing)

### Required Environment Variables

Before running the application, configure the following environment variables:

| Variable                               | Description                 |
| -------------------------------------- | --------------------------- |
| `REALPERFECT_JWT_SECRET`               | JWT signing secret          |
| `REALPERFECT_GOOGLE_GEOCODING_API_KEY` | Google Geocoding API key    |
| `REALPERFECT_GOOGLE_CLIENT_ID`         | Google OAuth2 Client ID     |
| `REALPERFECT_GOOGLE_CLIENT_SECRET`     | Google OAuth2 Client Secret |
| `REALPERFECT_MAIL_USERNAME`            | SMTP username               |
| `REALPERFECT_MAIL_PASSWORD`            | SMTP password               |

### Example

```bash
export REALPERFECT_JWT_SECRET="..."
export REALPERFECT_GOOGLE_GEOCODING_API_KEY="..."

export REALPERFECT_GOOGLE_CLIENT_ID="..."
export REALPERFECT_GOOGLE_CLIENT_SECRET="..."

export REALPERFECT_MAIL_USERNAME="..."
export REALPERFECT_MAIL_PASSWORD="..."
```

# FrontEnd dependencies and build
### Dependencies
NodeJs version 20
* `npm install -g @angular/cli` to install angular cli (globally)
* `npm install` to install Node packages

### Build
* environment.local.ts file required for local run (please extend environment.base.ts there)
* `ng serve` for `local`
* `ng build` to make files build for `prod`. Builds all to `dist` folder.

#Bootstrapping All Project
## For `local`:
_sh ./local/start_resources.sh_
## For `dev`:
build BackEnd and then build (serve) FrontEnd (access UI by FrontEnd port).
## For `prod`:
build (compile, 'compress', etc) FrontEnd into `dist` folder and then build BackEnd (access UI by BackEnd port).


(for project author)
TODO Project Next updates
- landing page
- make lemma based description and full-text-search
- perf tests
- Unit-tests
- MySQL cluster?
- Integrate Swagger
- to try CopyOnWriteArrayList, ConcurrentHashMap
- Graceful Shutdown