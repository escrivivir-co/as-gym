export const environment = {
  application:
  {
    name: 'angular-starter',
    angular: 'Angular 18.1.0 Dev',
    bootstrap: 'Bootstrap 5.3.3',
    fontawesome: 'Font Awesome 6.5.2',
  },
  urlNews: './assets/params/json/mock/trailers.json',
  urlMovies: './assets/params/json/mock/movies.json',

  /* urlNews: 'http://localhost:5004/trailers', */
  // url: 'https://api.escrivivir.co/tutorials',

  config: {
    /* SELECT ONE OF THOSE CONFIGURATIONS */

    /* LOCAL JSON (NO CRUD) */
    api: false,
    url: './assets/params/json/crud/',

    /* LOCAL REST API CRUD WITH POSTGRESQL */
    /* api: true,
    url: 'http://localhost:5004/', */
  },
};