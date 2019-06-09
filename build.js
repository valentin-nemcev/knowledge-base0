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
const assets = require('metalsmith-assets');


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

function addDates(file) {
  file.modificationDate = file.stats.mtime.toISOString();
  if (file.reviewDate != null)
    file.reviewDate = new Date(file.reviewDate).toISOString();
}

Metalsmith(__dirname)
  .use(paths({property: 'paths'}))
  .use(each(generateHref))
  .use(each(addDates))
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
    default: 'page.hbs'
  }))
  .use(
    each(function (file) {
      if (file.href) return './' + file.href + "index.html";
    }
  ))
  .use(
    assets({
      source: './assets',
      destination: './assets'
    })
  )
  .source('./content')
  .destination('./build')
  .build( (err) => {
    if (err) throw err;
  });
