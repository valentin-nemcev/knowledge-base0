const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const metalsmithInPlace = require('metalsmith-in-place');
var paths = require('metalsmith-paths')


const Handlebars = require('handlebars');

const inspect = require('util').inspect;

Handlebars.registerHelper('debug', function (context) {
  return new Handlebars.SafeString(
    '<pre class="debug">' + inspect(context) + '</pre>'
  );
});

Metalsmith(__dirname)
  .use(paths({
    property: "paths"
  }))
  .use(collections({
    articles: {
      pattern: 'articles/*.md',
      refer: false
    }
  }))
  .use(metalsmithInPlace({
    engine: 'handlebars',
    partials: 'templates/partials',
  }))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: 'templates',
    partials: 'templates/partials',
    default: 'article.hbs'
  }))
  .use(permalinks({
    pattern: './:collection/:title'
  }))
  .source('./content')
  .destination('./build')
  .build( (err) => {
    if (err) throw err;
  });
