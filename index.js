/* 
    Declare exports
*/

const zpt = {};

import { parser } from './js/app/parsers/parser.js';
zpt.parser = parser;

zpt.run = function( options ){
    return parser.run( options );
};

import { I18n } from './js/app/i18n/i18n.js';
zpt.I18n = I18n;

import { I18nBundle } from './js/app/i18n/i18nBundle.js';
zpt.I18nBundle = I18nBundle;

import { i18nHelper } from './js/app/i18n/i18nHelper.js';
zpt.i18nHelper = i18nHelper;

import { context } from './js/app/context.js';
zpt.context = context;

import { logHelper } from './js/app/logHelper.js';
zpt.logHelper = logHelper;

import { expressionBuilder } from './js/app/expressions/expressionBuilder.js';
zpt.expressionBuilder = expressionBuilder;

import { evaluateHelper } from './js/app/expressions/evaluateHelper.js';
zpt.evaluateHelper = evaluateHelper;

import { ExpressionTokenizer } from './js/app/expressions/expressionTokenizer.js';
zpt.ExpressionTokenizer = ExpressionTokenizer;

import { ReactiveDictionary } from './js/app/scopes/reactiveDictionary.js';
zpt.ReactiveDictionary = ReactiveDictionary;

import { version } from './js/app/version.js';
zpt.version = version;

export { zpt };
