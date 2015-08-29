# Spareparts

### Запуск

Запускается стандартно

    node app.js

Висит на 3000 порту по умолчанию, либо process.env.PORT

## Фаиловая структура (not final)
    
    app.js              --> app config
    package.json        --> for npm
    public/             --> all of the files to be used in on the client side
      css/              --> css files
        app.css             --> default stylesheet
        bootstrap.min.css   --> bootstrap stylesheet
      img/              --> image files
      js/               --> javascript files
        app.js          --> declare top-level app module
        admin.js        --> declare top-level adminApp module
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        lib/            --> angular and 3rd party JavaScript libraries
          angular/
            angular.js            --> the latest angular js
            angular.min.js        --> the latest minified angular js
            angular-*.js          --> angular add-on modules
            version.txt           --> version number
    routes/
      api.js            --> route for serving JSON
      index.js          --> route for serving HTML pages and partials
    views/
      index.jade        --> no use
      secure.jade       --> user page
      admin.jade        --> admin page
      layout.jade       --> doctype, title, head boilerplate
      partials/         --> not using
        partial1.jade
        partial2.jade

