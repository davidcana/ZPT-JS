/* 
    expressionBuilder singleton class
*/
module.exports = (function() {
    "use strict";
    
    var context = require( '../context.js' );
    var ExpressionTokenizer = require( '../expressionTokenizer.js' );
    var PathExpression = require( './path/pathExpression.js' );
    var expressionCache = require( '../cache/expressionCache.js' );
    /*var log = require( '../logHelper.js' );*/
    
    var expressionManagers = {};
    var withoutPrefixExpressionManagers = {};
    var DEFAULT_ID = PathExpression.getId();
    
    /* Register expression managers */
    var register = function( expressionsManager, id ) {
        expressionManagers[ id || expressionsManager.getPrefix() || expressionsManager.getId() ] = expressionsManager;
        
        if ( ! expressionsManager.removePrefix && expressionsManager.getPrefix() ){
            withoutPrefixExpressionManagers[ expressionsManager.getPrefix() ] = expressionsManager;
        }
    };
    
    var registerGeneralPurpose = function(){
        register( require( './existsExpression.js' ) );
        register( require( './formatExpression.js' ) );
        register( require( './stringExpression.js' ) );
        register( require( './path/pathExpression.js' ) );
    };
    var registerComparison = function(){
        register( require( './comparison/equalsExpression.js' ) );
        register( require( './comparison/greaterExpression.js' ) );
        register( require( './comparison/lowerExpression.js' ) );
    };
    var registerArithmetic = function(){
        register( require( './arithmethic/addExpression.js' ) );
        register( require( './arithmethic/substractExpression.js' ) );
        register( require( './arithmethic/multiplyExpression.js' ) );
        register( require( './arithmethic/divideExpression.js' ) );
        register( require( './arithmethic/modExpression.js' ) );
    };
    var registerLogical = function(){
        register( require( './bool/andExpression.js' ) );
        register( require( './bool/condExpression.js' ) );
        register( require( './bool/notExpression.js' ) );
        register( require( './bool/orExpression.js' ) );
    };
    var registerI18n = function(){
        register( require( './i18n/trCurrencyExpression.js' ) );
        register( require( './i18n/trDateTimeExpression.js' ) );
        register( require( './i18n/trNumberExpression.js' ) );
        register( require( './i18n/trStringExpression.js' ) );
    };
    var registerScripting = function(){
        register( require( './scripting/javascriptExpression.js' ) );
        register( require( './scripting/jqueryExpression.js' ) );
    };
    
    var registerAll = function(){
        registerGeneralPurpose();
        registerComparison();
        registerArithmetic();
        registerLogical();
        registerI18n();
        registerScripting();
    }();
    /* End Register expression managers */
    
    var build = function( string, force ) {
        return expressionCache.get(
                string, 
                function(){
                    return forceBuild( string );
                }, 
                force
        );
        /*
        log.info( 
            'Request building of expression "' + string + '", force "' + force + '"' );
        
        // Get from cache if possible
        if ( ! force && context.getConf().expressionCacheOn ){
            log.info( 'Cache ON!' );
            var fromCache = expressionCache.get( string );
            if ( fromCache ){
                log.info( 'Found in cache!' );
                return fromCache;
            } else {
                log.info( 'NOT found in cache!' );
            }
        } else {
            log.info( 'Cache OFF!' );
        }
        
        // Force build and put into cache
        log.info( 'Must build!' );
        var builded = forceBuild( string );
        expressionCache.put( string, builded );
        return builded;*/
    };
    
    var forceBuild = function( string ) {
        var effectiveString = removeParenthesisIfAny( string.trim() );
        var index = effectiveString.indexOf( context.getConf().expressionSuffix );
        var id = undefined;
        var isDefault = false;
        
        // Is the default expression type? Is registered?
        if ( index !== -1 ){
            id = effectiveString.substring( 0, index )  + ':';
            
            // If the id is not resistered must be a path
            isDefault = ! expressionManagers.hasOwnProperty( id );
        } else {
            isDefault = true;
        }
        
        // Remove prefix and set id if it is default expression type
        var removePrefix = false;
        var expressionManager = undefined;
        if ( isDefault ){
            /*id = DEFAULT_ID;*/
            expressionManager = getWithoutPrefixExpressionManager( effectiveString );
        } else {
            removePrefix = true;
        }
        
        // Get the expression manager and build the expression
        expressionManager = expressionManager || expressionManagers[ id ];
        var finalString = undefined;
        if ( removePrefix && expressionManager.removePrefix ){
            finalString = effectiveString.substr( id.length );
        } else {
            finalString = effectiveString;
        }
        return expressionManager.build( finalString );
    };
    
    var getWithoutPrefixExpressionManager = function( string ){
        
        for ( var prefix in withoutPrefixExpressionManagers ) {
            if ( string.indexOf( prefix ) == 0 ) {
                return withoutPrefixExpressionManagers[ prefix ];
            }
        }
        
        return expressionManagers[ DEFAULT_ID ];
    };
    
    var buildList = function( segments ) {
        var list = [];
        
        while ( segments.hasMoreTokens() ) {
            list.push(
                build( 
                    segments.nextToken().trim()  ) );
        }

        return list;
    };
    
    var removePrefix = function( string, prefix ) {
        return string.substr( prefix.length );
    };
    
    var removePrefixAndBuild = function( string, prefix ) {
        return build(
                string.substr( prefix.length ));
    };
    
    var removeParenthesisIfAny = function( token ){
        var effectiveToken = token.trim();
        
        if ( effectiveToken == '' ){
            return effectiveToken;
        }
        
        if ( effectiveToken.charAt( 0 ) == '(' ){
            return removeParenthesisIfAny( 
                        effectiveToken.substring( 1, effectiveToken.lastIndexOf( ')' ) ).trim() );
        }
        
        return effectiveToken;
    };
    
    var endsWith = function( str, suffix ) {
        return str.indexOf( suffix, str.length - suffix.length ) !== -1;
    };
    
    var getArgumentsFromString = function( string ) {
        
        // Parse and evaluate arguments; then push them to an array
        var tokens = new ExpressionTokenizer( 
                string, 
                context.getConf().argumentsDelimiter, 
                true );
        var args = [];
        while ( tokens.hasMoreTokens() ) {
            var currentString = tokens.nextToken().trim();
            args.push( 
                    build( currentString ) );
        }
        
        return args;
    };
    
    return {
        register: register,
        registerAll: registerAll,
        build: build,
        buildList: buildList,
        removePrefix: removePrefix,
        removePrefixAndBuild: removePrefixAndBuild,
        removeParenthesisIfAny: removeParenthesisIfAny,
        endsWith: endsWith,
        getArgumentsFromString: getArgumentsFromString
    };
})();
