const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');

const Handlebars = require('handlebars');

const inspect = require('util').inspect;

Handlebars.registerHelper('debug', function (context) {
  return new Handlebars.SafeString(
    '<pre class="debug">' + inspect(context) + '</pre>'
  );
});

Metalsmith(__dirname)
  .use(collections({
    articles: {
      pattern: 'articles/*.md',
      refer: false
    }
  }))
  .use(markdown())
  .use(permalinks({
    pattern: ':collection/:title'
  }))
  .use(layouts({
    engine: 'handlebars',
    default: 'article.hbs'
  }))
  .source('./content')
  .destination('./build')
  .build( (err) => {
    if (err) throw err;
  });
