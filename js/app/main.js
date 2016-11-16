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

/* Support RequireJS module pattern */
if ( typeof define === 'function' && define.amd ) {
    define( 'zpt.run', exports.run );
    define( 'zpt.I18n', exports.I18n );
    define( 'zpt.i18nHelper', exports.i18nHelper );
}