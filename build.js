const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');

Metalsmith(__dirname)
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    default: 'article.hbs'
  }))
  .destination('./build')
  .build( (err) => {
    if (err) throw err;
  });
