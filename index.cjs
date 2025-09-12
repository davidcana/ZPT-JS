/*
    Declare exports
*/

const zpt = require( './dist/zpt-cjs.cjs' ).zpt;

exports.parser = zpt.parser;

exports.run = function( options ){
    return zpt.parser.run( options );
};

exports.I18n = zpt.I18n;
exports.I18nBundle = zpt.I18nBundle;
exports.i18nHelper = zpt.i18nHelper;
exports.context = zpt.context;
exports.logHelper = zpt.logHelper;
exports.expressionBuilder = zpt.expressionBuilder;
exports.evaluateHelper = zpt.evaluateHelper;
exports.ExpressionTokenizer = zpt.ExpressionTokenizer;
exports.ReactiveDictionary = zpt.ReactiveDictionary;
exports.version = zpt.version;

