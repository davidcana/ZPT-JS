/*
    Declare exports
*/
exports.run = function( options ){
    var parser = require( './parsers/parser.js' );
    return parser.run( options );
};

exports.I18n = require( './i18n/i18n.js' );
exports.I18nBundle = require( './i18n/i18nBundle.js' );
exports.i18nHelper = require( './i18n/i18nHelper.js' );
exports.context = require( './context.js' );
exports.logHelper = require( './logHelper.js' );
exports.expressionBuilder = require( './expressions/expressionBuilder.js' );
exports.evaluateHelper = require( './expressions/evaluateHelper.js' );
exports.ExpressionTokenizer = require( './expressions/expressionTokenizer.js' );
exports.ReactiveDictionary = require( './scopes/reactiveDictionary.js' );
exports.version = require( './version.js' );

