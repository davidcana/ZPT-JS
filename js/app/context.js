/* 
    context singleton class
*/

var log4javascript = require( 'log4javascript' );
var utils = require( './utils.js' );
var LoopItem = require( './parsers/loopItem.js' );
var CSSAnimationManager = require( './parsers/dictionaryActions/cssAnimationManager.js' );

module.exports = (function() {
    "use strict";
    
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
        talDeclare:         "data-declare",
        metalDefineMacro: "data-define-macro",
        metalUseMacro:    "data-use-macro",
        metalDefineSlot:  "data-define-slot",
        metalFillSlot:    "data-fill-slot",
        metalMacro:       "data-mmacro",
        i18nDomain:       "data-domain",
        i18nLanguage:     "data-language",
        //scopeKey:         "data-scope-key",
        rootKey:          "data-root-key",
        qdup:             "data-qdup",
        id:               "data-id",
        relatedId:        "data-related-id",
        conditionResult:  "data-condition-result"
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
        talDeclare:       "tal:declare",
        metalDefineMacro: "metal:define-macro",
        metalUseMacro:    "metal:use-macro",
        metalDefineSlot:  "metal:define-slot",
        metalFillSlot:    "metal:fill-slot",
        metalMacro:       "data-mmacro",
        i18nDomain:       "i18n:domain",
        i18nLanguage:     "i18n:language",
        //scopeKey:         "data-scope-key",
        rootKey:          "data-root-key",
        qdup:             "data-qdup",
        id:               "data-id",
        relatedId:        "data-related-id",
        conditionResult:  "data-condition-result"
    };
    var tags = defaultTags;
    var tal = '';
    
    var getTags = function (){
        return tags;
    };
    
    var setTags = function ( tagsToSet ){
        tags = tagsToSet;
        tal = '';
    };
    
    var getTal = function (){
        if ( tal === '' ){
            var c = 0;
            var notInclude = tags.qdup;
            for ( var property in tags ) {
                if ( notInclude === tags[ property ] ){
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
    var EXPRESSION_SUFFIX = ':';
    var PRIVATE_VARS_PREFIX = '_';
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
        declareDelimiter:         ';',
        inDeclareDelimiter:       ' ',
        
        i18nConfResourceId:      "/CONF/",
        
        htmlStructureExpressionPrefix:  "structure",
        globalVariableExpressionPrefix: "global",
        nocallVariableExpressionPrefix: "nocall",
        
        templateErrorVarName:    "error",
        onErrorVarName:          PRIVATE_VARS_PREFIX + "on-error",
        onErrorStructureVarName: PRIVATE_VARS_PREFIX + "on-error-structure",
        i18nDomainVarName:       PRIVATE_VARS_PREFIX + "i18nDomain",
        i18nLanguageVarName:     PRIVATE_VARS_PREFIX + "i18nLanguage",
        externalMacroUrlVarName: PRIVATE_VARS_PREFIX + "externalMacroUrl",
        strictModeVarName:       PRIVATE_VARS_PREFIX + "strictMode",
        declaredVarsVarName:     PRIVATE_VARS_PREFIX + "declaredVars",
        repeatVarName:           PRIVATE_VARS_PREFIX + "repeat",
        
        windowVarName:           "window",
        contextVarName:          "context",
        
        nothingVarName:          "nothing",
        defaultVarName:          "default",
        nothingVarValue:         "___nothing___",
        defaultVarValue:         "___default___",
        
        loggingOn:    false,
        loggingLevel: log4javascript.Level.ERROR,

        externalMacroPrefixURL: "",
        variableNameRE:         /^[A-Za-z0-9_/-]+$/,
        expressionCacheOn:      true,
        attributeCacheOn:       true,

        expressionSuffix:     EXPRESSION_SUFFIX,
        stringExpression:     "string" + EXPRESSION_SUFFIX,
        existsExpression:     "exists" + EXPRESSION_SUFFIX,
        notExpression:        "not" + EXPRESSION_SUFFIX,
        javaScriptExpression: "js" + EXPRESSION_SUFFIX,
        equalsExpression:     "eq" + EXPRESSION_SUFFIX,
        greaterExpression:    "gt" + EXPRESSION_SUFFIX,
        lowerExpression:      "lt" + EXPRESSION_SUFFIX,
        addExpression:        "+" + EXPRESSION_SUFFIX,
        subExpression:        "-" + EXPRESSION_SUFFIX,
        mulExpression:        "*" + EXPRESSION_SUFFIX,
        divExpression:        "/" + EXPRESSION_SUFFIX,
        modExpression:        "%" + EXPRESSION_SUFFIX,
        orExpression:         "or" + EXPRESSION_SUFFIX,
        andExpression:        "and" + EXPRESSION_SUFFIX,
        condExpression:       "cond" + EXPRESSION_SUFFIX,
        formatExpression:     "format" + EXPRESSION_SUFFIX,
        trExpression:         "tr" + EXPRESSION_SUFFIX,
        trNumberExpression:   "trNumber" + EXPRESSION_SUFFIX,
        trCurrencyExpression: "trCurrency" + EXPRESSION_SUFFIX,
        trDateTimeExpression: "trDate" + EXPRESSION_SUFFIX,
        inExpression:         "in" + EXPRESSION_SUFFIX,
        queryExpression:      "query" + EXPRESSION_SUFFIX,
        pathExpression:       "",
        
        firstIndexIdentifier: "_first_",
        lastIndexIdentifier:  "_last_"
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
        checked: 1,
        compact: 1,
        declare: 1,
        defer: 1,
        disabled: 1,
        ismap: 1,
        multiple: 1,
        nohref: 1,
        noresize: 1,
        noshade: 1,
        nowrap: 1,
        readonly: 1,
        selected: 1
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
        className: 1,
        class: 1,
        href: 1,
        htmlFor: 1,
        id: 1,
        innerHTML: 1,
        label: 1,
        style: 1,
        src: 1,
        text: 1,
        title: 1,
        value: 1
    };
    // All booleanAttributes are also altAttributes
    utils.extend( altAttributes, booleanAttributes );
    
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
    var defaultErrorFunction = function( error ) {
        
        var msg = Array.isArray( error )?
            error.join( '\n' ):
            error;
        
        window.alert( msg );
        
        throw msg;
    };
    var errorFunction = defaultErrorFunction;
    var setErrorFunction = function( _errorFunction ){
        self.errorFunction = _errorFunction;
    };
    var asyncError = function( url, errorMessage, failCallback ){

        var msg = 'Error trying to get ' + url + ': ' + errorMessage;
        if ( failCallback ){
            failCallback( msg );
        } else {
            errorFunction( msg );
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
    
    /* Strict mode  */
    var strictMode = false;
    var setStrictMode = function( _strictMode ){
        strictMode = _strictMode;
    };
    var isStrictMode = function(){
        return strictMode;
    };
    /* End strict mode  */
    
    /* Expression counter */
    var expressionCounter = 0;
    var nextExpressionCounter = function(){
        return ++expressionCounter;
    };
    var setExpressionCounter = function( _expressionCounter ){
        expressionCounter = _expressionCounter;
    };
    /* End expression counter */
    
    /* Run counter */
    var runCounter = 0;
    var nextRunCounter = function(){
        return ++runCounter;
    };
    /* End run counter */
    
    /* Animation managers */
    var defaultAnimationManager = CSSAnimationManager;
    var animationManager = defaultAnimationManager;
    var getAnimationManager = function(){
        return animationManager;
    };
    var setAnimationManager = function( _animationManager ){
        animationManager = _animationManager;
    };
    /* End animation managers*/
    
    var self = {
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
        errorFunction: errorFunction,
        setErrorFunction: setErrorFunction,
        asyncError: asyncError,
        repeat: repeat,
        setFolderDictionaries: setFolderDictionaries,
        getFolderDictionaries: getFolderDictionaries,
        setStrictMode: setStrictMode,
        isStrictMode: isStrictMode,
        nextExpressionCounter: nextExpressionCounter,
        setExpressionCounter: setExpressionCounter,
        nextRunCounter: nextRunCounter,
        getAnimationManager: getAnimationManager,
        setAnimationManager: setAnimationManager
    };
    
    return self;
})();
