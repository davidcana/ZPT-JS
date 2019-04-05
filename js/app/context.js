/* 
    context singleton class
*/
module.exports = (function() {
    "use strict";
    
    var log4javascript = require( 'log4javascript' );
    var $ = require( 'jquery' );
    
    /* Tags */
    var defaultTags = {
        talCondition:     "data-tcondition",
        talRepeat:        "data-trepeat",
        talAttributes:    "data-tattributes",
        talContent:       "data-tcontent",
        talDefine:        "data-tdefine",
        talOmitTag:       "data-tomit-tag",
        talReplace:       "data-treplace",
        talOnError:       "data-ton-error",
        metalDefineMacro: "data-mdefine-macro",
        metalUseMacro:    "data-muse-macro",
        metalDefineSlot:  "data-mdefine-slot",
        metalFillSlot:    "data-mfill-slot",
        metalMacro:       "data-mmacro",
        i18nDomain:       "data-idomain",
        i18nLanguage:     "data-ilanguage",
        scopeKey:         "data-scope-key",
        qdup:             "data-qdup"
    };
    var originalTags = {
        talCondition:     "tal:condition",
        talRepeat:        "tal:repeat",
        talAttributes:    "tal:attributes",
        talContent:       "tal:content",
        talDefine:        "tal:define",
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
        scopeKey:         "data-scope-key",
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

        htmlStructureExpressionPrefix:  "html",
        globalVariableExpressionPrefix: "global",

        templateErrorVarName:    "error",
        onErrorVarName:          "on-error",
        i18nDomainVarName:       "i18nDomain",
        i18nLanguageVarName:     "i18nLanguage",
        repeatVarName:           "repeat",
        externalMacroUrlVarName: "externalMacroUrl",
        windowVarName:           "window",
        contextVarName:          "context",
        
        i18nConfResourceId: '/CONF/',

        loggingOn: false,
        loggingLevel: log4javascript.Level.ERROR,

        externalMacroPrefixURL: '',
        
        expressionCacheOn: true,
        attributeCacheOn: true,

        expressionSuffix: EXPRESSION_SUFFIX,
        stringExpression: "string" + EXPRESSION_SUFFIX,
        existsExpression: "exists" + EXPRESSION_SUFFIX,
        noCallExpression: "nocall" + EXPRESSION_SUFFIX,
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
    
    return {
        getTags: getTags,
        setTags: setTags,
        getTal: getTal,
        getFormatter: getFormatter,
        registerFormatter: registerFormatter,
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
        asyncError: asyncError
    };
})();
