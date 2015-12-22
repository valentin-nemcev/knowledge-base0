const createDebug = require('debug');
const inspect = require('util').inspect;

const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const collections = require('metalsmith-collections');
const metalsmithInPlace = require('metalsmith-in-place');
const paths = require('metalsmith-paths');
const slug = require('slug');
const each = require('metalsmith-each');


const Handlebars = require('handlebars');

Handlebars.registerHelper('debug', function (context) {
  return new Handlebars.SafeString(
    '<pre class="debug">' + inspect(context) + '</pre>'
  );
});

{
  const debug = createDebug('generate-href')
  function generateHref(file, filename) {
    if (file.paths.name === 'index' || !('title' in file)) return;
    file.slug = slug(file.title, {lower: true})
    debug('checking file: ' + filename);
    if (file.slug !== file.paths.name) {
      throw new Error( [
        'Filename and title mismatch:', file.paths.name, file.slug
      ].join(' '));
    }
    file.href = '/' + file.paths.dir + '/' + file.slug + '/';
  }
}

Metalsmith(__dirname)
  .use(paths({property: 'paths'}))
  .use(each(generateHref))
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
  .use(
    each(function (file) {
      if (file.href) return './' + file.href + "index.html";
    }
  ))
  .source('./content')
  .destination('./build')
  .build( (err) => {
    if (err) throw err;
  });
