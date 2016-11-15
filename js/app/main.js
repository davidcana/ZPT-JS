/*
    run function
*/
exports.run = function( options ){
    var Parser = require( './parser.js' );

    var parser =  new Parser( options );
    parser.run();
};

/* I18n and i18nHelp classes */
exports.I18n = require( './i18n.js' );
exports.i18nHelper = require( './i18nHelper.js' );