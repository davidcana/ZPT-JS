/*
    run function
*/
exports.run = function( options ){
    
    var Parser = require( './parsers/parser.js' );
    
    var parser =  new Parser( options );
    parser.run();
};

/* I18n and i18nHelp classes */
exports.I18n = require( './i18n/i18n.js' );
exports.i18nHelper = require( './i18n/i18nHelper.js' );
exports.context = require( './context.js' );

/* Support RequireJS module pattern */
if ( typeof define === 'function' && define.amd ) {
    define( 'zpt.run', exports.run );
    define( 'zpt.I18n', exports.I18n );
    define( 'zpt.i18nHelper', exports.i18nHelper );
    define( 'zpt.context', exports.context );
}