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

# FrontEnd dependencies and build
### Dependencies
NodeJs version 18
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


TODO Project Next updates
- landing page
- make lemma based description and full-text-search
- perf tests
- Unit-tests
- MySQL cluster?
- Integrate Swagger
- to try CopyOnWriteArrayList, ConcurrentHashMap
- Graceful Shutdown