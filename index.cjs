/*
    Declare exports
*/
exports.run = function( options ){
    var parser = require( './js/app/parsers/parser.js' );
    return parser.run( options );
};

exports.I18n = require( './js/app/i18n/i18n.js' );
exports.I18nBundle = require( './js/app/i18n/i18nBundle.js' );
exports.i18nHelper = require( './js/app/i18n/i18nHelper.js' );
exports.context = require( './js/app/context.js' );
exports.logHelper = require( './js/app/logHelper.js' );
exports.expressionBuilder = require( './js/app/expressions/expressionBuilder.js' );
exports.evaluateHelper = require( './js/app/expressions/evaluateHelper.js' );
exports.ExpressionTokenizer = require( './js/app/expressions/expressionTokenizer.js' );
//exports.ReactiveDictionary = require( './js/app/scopes/reactiveDictionary.js' );
exports.version = require( './js/app/version.js' );

