/**
 * TEST JADEIFY
 */
exports = module.exports = jadeify = function(options) {

  var defaultOptions = {
    jsFile: '/javascripts/jade.tmpl.js'
  };
  
  if (!options.jsFile) {
    throw('No options.jsFile param set');
  }
  if (!options.tmplFolder) {
    throw('No options.tmplFolder param set');
  }
  if (!options.publicFolder) {
    throw('No options.publicFolder param set');
  }

  return function(req, res, next) {
  
    if ('GET' != req.method && 'HEAD' !== req.method) {
      return next();
    }
  
    if (req.url === options.jsFile) {
      var fs = require('fs');
      var path = require('path');
    
      fs.readdir(options.tmplFolder, function(err, files){
        if (err) return next(err);
      
        var templates = [];
        var data;
        files.forEach(function(file){
        
          file = path.join(options.tmplFolder, file);

          data = fs.readFileSync(file, 'utf8');
          templates.push(
            path.basename(file, '.jade') + ': [\'' + data.replace(/\'/g, '\\\'').replace(/\n/g, '\',\n\'') + '\'].join(\'\\n\')'
          );
        });
      
        var output = 'var jade = {};jade.render = function(template, params) { var templates = {\n' +
          templates.join(',\n') +
          '};' +
          'return require(\'jade\').render(templates[template], {locals:params});' +
          '};';
      
        fs.writeFileSync(path.join(options.publicFolder, options.jsFile), output, 'utf8');
        next();
      });
    }
    else {
      return next();
    }
  };
};
