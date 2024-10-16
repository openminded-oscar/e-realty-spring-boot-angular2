# Git clone, after that install dependencies:
[backend/local/start_resources.sh](backend/local/start_resources.sh)

# BackEnd build
####Dependencies
* Maven 3, Java 16, Docker, MySQLV8
####Build
* `mvn spring-boot:run -P dev|prod "-Dspring-boot.run.jvmArguments=--add-opens"`

# FrontEnd dependencies and build
####Dependencies
* `npm install -g @angular/cli` to install angular cli (globally)
* `npm install` to install Node packages
####Build
* `ng serve` for `dev`
* `ng build` to make files build for `prod`. Builds all to `dist` folder.

#Bootstrapping All Project
## For `local`:
_sh ./local/start_resources.sh_
## For `dev`:
build BackEnd and then build (serve) FrontEnd (access UI by FrontEnd port).
## For `prod`:
build (compile, 'compress', etc) FrontEnd into `dist` folder and then build BackEnd (access UI by BackEnd port).


TODO
- Integrate ElasticSearch for full-text search by realty object description
- Integrate Swagger
- Implement RENT feature
