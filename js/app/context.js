/* 
    context singleton class
*/
"use strict";

var log4javascript = require( 'log4javascript' );
var $ = require( 'jquery' );
var LoopItem = require( './parsers/loopItem.js' );

module.exports = (function() {
    
    /* Tags */
    var defaultTags = {
        talCondition:     "data-condition",
        talRepeat:        "data-repeat",
        talAttributes:    "data-attributes",
        talContent:       "data-content",
        talDefine:        "data-define",
        talAutoDefine:    "data-tauto-define",
        talOmitTag:       "data-omit-tag",
        talReplace:       "data-replace",
        talOnError:       "data-on-error",
        metalDefineMacro: "data-define-macro",
        metalUseMacro:    "data-use-macro",
        metalDefineSlot:  "data-define-slot",
        metalFillSlot:    "data-fill-slot",
        metalMacro:       "data-mmacro",
        i18nDomain:       "data-domain",
        i18nLanguage:     "data-language",
        //scopeKey:         "data-scope-key",
        rootKey:          "data-root-key",
        qdup:             "data-qdup"
    };
    var originalTags = {
        talCondition:     "tal:condition",
        talRepeat:        "tal:repeat",
        talAttributes:    "tal:attributes",
        talContent:       "tal:content",
        talDefine:        "tal:define",
        talAutoDefine:    "tal:auto-define",
        talOmitTag:       "tal:omit-tag",
        talReplace:       "tal:replace",
        talOnError:       "tal:on-error",
        metalDefineMacro: "metal:define-macro",
        metalUseMacro:    "metal:use-macro",
        metalDefineSlot:  "metal:define-slot",
        metalFillSlot:    "metal:fill-slot",
        metalMacro:       "data-mmacro",
        i18nDomain:       "i18n:domain",
        i18nLanguage:     "i18n:language",
        //scopeKey:         "data-scope-key",
        rootKey:          "data-root-key",
        qdup:             "data-qdup"
    };
    var tags = defaultTags;
    var tal = '';
    //var self = this;
    
    var getTags = function (){
        return tags;
    };
    
    var setTags = function ( tagsToSet ){
        tags = tagsToSet;
        tal = '';
    };
    
    var getTal = function (){
        if ( tal == '' ){
            var c = 0;
            var notInclude = tags.qdup;
            for ( var property in tags ) {
                if ( notInclude == tags[ property ] ){
                    continue;
                }
                if ( c++ > 0){
                    tal += ",";
                }
                tal += "*[" + tags[ property ] + "]";
            }
        }
        
        return tal;
    };
    var useOriginalTags = function(){
        setTags( originalTags );
    };
    /* End Tags */
    
    /* Formatters */
    var formatters = {};
    formatters.lowerCase = function ( value ){
        return value.toLocaleLowerCase();
    };
    formatters.upperCase = function ( value ){
        return value.toLocaleUpperCase();
    };
    formatters.localeDate = function ( value ){
        return value.toLocaleDateString;
    };
    formatters.localeTime = function ( value ){
        return value.toLocaleTimeString;
    };
    formatters.localeString = function ( value, locale ){
        return locale? 
               value.toLocaleString( value, locale ): 
               value.toLocaleString( value );
    };
    formatters.fix = function ( number, fixTo ){
        return number.toFixed( fixTo );
    };
    
    var getFormatter = function ( id ){
        return formatters[ id ];
    };
    
    var registerFormatter = function ( id, formatter ){
        formatters[ id ] = formatter;
    };
    var unregisterFormatter = function ( id ){
        delete formatters[ id ];
    };
    /* End Formatters */
    
    /* Conf */
    var EXPRESSION_SUFFIX = ":";
    var defaultConf = {
        pathDelimiter:          '|',
        pathSegmentDelimiter:   '/',
        expressionDelimiter:    ' ',
        intervalDelimiter:      ':',
        propertyDelimiter:      '/',
        defineDelimiter:        ';',
        inDefineDelimiter:      ' ',
        attributeDelimiter:     ';',
        inAttributeDelimiter:   ' ',
        domainDelimiter:        ' ',
        i18nOptionsDelimiter:   ';',
        inI18nOptionsDelimiter: ' ',
        argumentsDelimiter:     ',',
        macroDelimiter:         '@',
        propsDelimiter:         ';',
        inPropsDelimiter:       ' ',
        
        htmlStructureExpressionPrefix:  "structure",
        globalVariableExpressionPrefix: "global",
        nocallVariableExpressionPrefix: "nocall",
        
        templateErrorVarName:    "error",
        onErrorVarName:          "on-error",
        onErrorStructureVarName: "on-error-structure",
        i18nDomainVarName:       "i18nDomain",
        i18nLanguageVarName:     "i18nLanguage",
        repeatVarName:           "repeat",
        externalMacroUrlVarName: "externalMacroUrl",
        windowVarName:           "window",
        contextVarName:          "context",
        nothingVarName:          "nothing",
        defaultVarName:          "default",
        i18nConfResourceId:      '/CONF/',
        
        nothingVarValue:         "___nothing___",
        defaultVarValue:         "___default___",
        
        loggingOn: false,
        loggingLevel: log4javascript.Level.ERROR,

        externalMacroPrefixURL: '',
        
        expressionCacheOn: true,
        attributeCacheOn: true,

        expressionSuffix: EXPRESSION_SUFFIX,
        stringExpression: "string" + EXPRESSION_SUFFIX,
        existsExpression: "exists" + EXPRESSION_SUFFIX,
        //noCallExpression: "nocall" + EXPRESSION_SUFFIX,
        notExpression: "not" + EXPRESSION_SUFFIX,
        javaScriptExpression: "js" + EXPRESSION_SUFFIX,
        equalsExpression: "eq" + EXPRESSION_SUFFIX,
        greaterExpression: "gt" + EXPRESSION_SUFFIX,
        lowerExpression: "lt" + EXPRESSION_SUFFIX,
        addExpression: "+" + EXPRESSION_SUFFIX,
        subExpression: "-" + EXPRESSION_SUFFIX,
        mulExpression: "*" + EXPRESSION_SUFFIX,
        divExpression: "/" + EXPRESSION_SUFFIX,
        modExpression: "%" + EXPRESSION_SUFFIX,
        orExpression: "or" + EXPRESSION_SUFFIX,
        andExpression: "and" + EXPRESSION_SUFFIX,
        condExpression: "cond" + EXPRESSION_SUFFIX,
        formatExpression: "format" + EXPRESSION_SUFFIX,
        trExpression: "tr" + EXPRESSION_SUFFIX,
        trNumberExpression: "trNumber" + EXPRESSION_SUFFIX,
        trCurrencyExpression: "trCurrency" + EXPRESSION_SUFFIX,
        trDateTimeExpression: "trDate" + EXPRESSION_SUFFIX,
        inExpression: "in" + EXPRESSION_SUFFIX,
        /*pathExpression: "path" + EXPRESSION_SUFFIX,*/
        pathExpression: "",
        jqueryExpression: "$"
    };
    var conf = defaultConf;
    
    var getConf = function (){
        return conf;
    };
    
    var setConf = function ( confToSet ){
        conf = confToSet;
    };
    /* End conf */
    
    /* Logger */
    var logger;
    var getDefaultLogger = function (){
        
        var defaultLogger = log4javascript.getDefaultLogger();
        
        defaultLogger.setLevel( getConf().loggingLevel );
        //defaultLogger.removeAllAppenders();
        //defaultLogger.addAppender( new log4javascript.BrowserConsoleAppender( true ) );
        
        return defaultLogger;
    };
    var getLogger = function (){
        
        if ( ! logger && getConf().loggingOn ){
            logger = getDefaultLogger();
        }
        
        return logger;
    };
    var setLogger = function ( loggerToSet ){
        logger = loggerToSet;
    };
    /* End Logger */
    
    /* 
        Boolean attributes:
        The presence of a boolean attribute on an element represents the true value, and the absence of the attribute represents the false value.
    */
    var booleanAttributes = {
        "checked" : 1,
        "compact" : 1,
        "declare" : 1,
        "defer" : 1,
        "disabled" : 1,
        "ismap" : 1,
        "multiple" : 1,
        "nohref" : 1,
        "noresize" : 1,
        "noshade" : 1,
        "nowrap" : 1,
        "readonly" : 1,
        "selected" : 1
    };
    
    var getBooleanAttributes = function (){
        return booleanAttributes;
    };
    var setBooleanAttributes = function ( booleanAttributesToSet ){
        booleanAttributes = booleanAttributesToSet;
    };
    var isBooleanAttribute = function ( attribute ){
        return booleanAttributes[ attribute ] === 1;
    };
    /* End Boolean attributes */
    
    /* 
        Alt attributes:
        Attributes which don't support setAttribute().
    */
    var altAttributes = {
        "className" : 1,
        "class" : 1,
        "href" : 1,
        "htmlFor" : 1,
        "id" : 1,
        "innerHTML" : 1,
        "label" : 1,
        "style" : 1,
        "src" : 1,
        "text" : 1,
        "title" : 1,
        "value" : 1
    };
    // All booleanAttributes are also altAttributes
    $.extend( altAttributes, booleanAttributes );
    
    var getAltAttributes = function (){
        return altAttributes;
    };
    var setAltAttributes = function ( altAttributesToSet ){
        altAttributes = altAttributesToSet;
    };
    var isAltAttribute = function ( attribute ){
        return altAttributes[ attribute ] === 1;
    };
    /* End Alt attributes */
    
    /* Errors */
    var defaultErrorFunction = function( errorMessage ){
        alert( errorMessage );
    };
    var errorFunction = defaultErrorFunction;
    var setErrorFunction = function( errorFunctionToSet ){
        errorFunction = errorFunctionToSet;
    };
    var error = function( errorMessage ){
        return errorFunction( errorMessage );
    };
    var asyncError = function( url, error, failCallback ){

        var msg = 'Error trying to get ' + url + ': ' + error;
        if ( failCallback ){
            failCallback( msg );
        } else {
            error( msg );
        }
    };
    /* End errors */
    
    /* Repeat */
    var repeat = function( index, length, offset ){
        return new LoopItem( index, length, offset );
    };
    /* End repeat*/
    
    /* Folder dictionaries */
    var folderDictionaries = [];
    var setFolderDictionaries = function( _folderDictionaries ){
        folderDictionaries = _folderDictionaries;
    };
    var getFolderDictionaries = function(){
        return folderDictionaries;
    };
    /* End folder dictionaries */
    
    return {
        getTags: getTags,
        setTags: setTags,
        getTal: getTal,
        getFormatter: getFormatter,
        registerFormatter: registerFormatter,
        unregisterFormatter: unregisterFormatter,
        getConf: getConf,
        setConf: setConf,
        getLogger: getLogger,
        setLogger: setLogger,
        useOriginalTags: useOriginalTags,
        getBooleanAttributes: getBooleanAttributes,
        setBooleanAttributes: setBooleanAttributes,
        isBooleanAttribute: isBooleanAttribute,
        getAltAttributes: getAltAttributes,
        setAltAttributes: setAltAttributes,
        isAltAttribute: isAltAttribute,
        setErrorFunction: setErrorFunction,
        asyncError: asyncError,
        repeat: repeat,
        setFolderDictionaries: setFolderDictionaries,
        getFolderDictionaries: getFolderDictionaries
    };
})();
