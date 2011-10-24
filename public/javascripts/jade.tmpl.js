var jade = {};jade.render = function(template, params) { var templates = {
_list: ['p',
'  strong This is an item on the list: ',
'  span= list'].join('\n')};return require('jade').render(templates[template], {locals:params});};