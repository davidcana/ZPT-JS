/*
    Exported functions
*/
exports.run = function( options ){
    
    var parser = require( './parsers/parser.js' );
    return parser.run( options );
};

/* Declare exports */
exports.I18n = require( './i18n/i18n.js' );
exports.I18nBundle = require( './i18n/i18nBundle.js' );
exports.i18nHelper = require( './i18n/i18nHelper.js' );
exports.context = require( './context.js' );
exports.logHelper = require( './logHelper.js' );
exports.expressionBuilder = require( './expressions/expressionBuilder.js' );
exports.evaluateHelper = require( './expressions/evaluateHelper.js' );
exports.ExpressionTokenizer = require( './expressions/expressionTokenizer.js' );

/* Support RequireJS module pattern */
if ( typeof define === 'function' && define.amd ) {
    define( 'zpt.run', exports.run );
    define( 'zpt.I18n', exports.I18n );
    define( 'zpt.I18nBundle', exports.I18nBundle );
    define( 'zpt.i18nHelper', exports.i18nHelper );
    define( 'zpt.context', exports.context );
    define( 'zpt.logHelper', exports.logHelper );
    define( 'zpt.expressionBuilder', exports.expressionBuilder );
    define( 'zpt.evaluateHelper', exports.evaluateHelper );
    define( 'zpt.ExpressionTokenizer', exports.ExpressionTokenizer );
}
