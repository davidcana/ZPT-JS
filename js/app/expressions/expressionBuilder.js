/* 
    expressionBuilder singleton class
*/

import { context } from '../context.js';
import { ExpressionTokenizer } from './expressionTokenizer.js';
import { PathExpression } from './path/pathExpression.js';
import { expressionCache } from '../cache/expressionCache.js';
import { ExistsExpression } from './existsExpression.js';
import { FormatExpression } from './formatExpression.js';
import { StringExpression } from './stringExpression.js';
import { EqualsExpression } from './comparison/equalsExpression.js';
import { GreaterExpression } from './comparison/greaterExpression.js';
import { LowerExpression } from './comparison/lowerExpression.js';
import { InExpression } from './comparison/inExpression.js';
import { AddExpression } from './arithmethic/addExpression.js';
import { SubstractExpression } from './arithmethic/substractExpression.js';
import { MultiplyExpression } from './arithmethic/multiplyExpression.js';
import { DivideExpression } from  './arithmethic/divideExpression.js';
import { ModExpression } from './arithmethic/modExpression.js';
import { AndExpression } from './bool/andExpression.js';
import { CondExpression } from './bool/condExpression.js';
import { NotExpression } from './bool/notExpression.js';
import { OrExpression } from './bool/orExpression.js';
import { TrCurrencyExpression } from './i18n/trCurrencyExpression.js';
import { TrDateTimeExpression } from './i18n/trDateTimeExpression.js';
import { TrNumberExpression } from './i18n/trNumberExpression.js';
import { TrStringExpression } from './i18n/trStringExpression.js';
import { JavascriptExpression } from './scripting/javascriptExpression.js';
import { QueryExpression } from './scripting/queryExpression.js';

export const expressionBuilder = (function() {
    
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
    
    var unregister = function( expressionsManager, id ) {
        delete expressionManagers[ id || expressionsManager.getPrefix() || expressionsManager.getId() ];
    };
    
    var registerGeneralPurpose = function(){
        //register( require( './existsExpression.js' ) );
        //register( require( './formatExpression.js' ) );
        //register( require( './stringExpression.js' ) );
        //register( require( './path/pathExpression.js' ) );
        register( ExistsExpression );
        register( FormatExpression );
        register( StringExpression );
        register( PathExpression );
    };
    var registerComparison = function(){
        //register( require( './comparison/equalsExpression.js' ) );
        //register( require( './comparison/greaterExpression.js' ) );
        //register( require( './comparison/lowerExpression.js' ) );
        //register( require( './comparison/inExpression.js' ) );
        register( EqualsExpression );
        register( GreaterExpression );
        register( LowerExpression );
        register( InExpression );
    };
    var registerArithmetic = function(){
        //register( require( './arithmethic/addExpression.js' ) );
        //register( require( './arithmethic/substractExpression.js' ) );
        //register( require( './arithmethic/multiplyExpression.js' ) );
        //register( require( './arithmethic/divideExpression.js' ) );
        //register( require( './arithmethic/modExpression.js' ) );
        register( AddExpression );
        register( SubstractExpression );
        register( MultiplyExpression );
        register( DivideExpression );
        register( ModExpression );
    };
    var registerLogical = function(){
        //register( require( './bool/andExpression.js' ) );
        //register( require( './bool/condExpression.js' ) );
        //register( require( './bool/notExpression.js' ) );
        //register( require( './bool/orExpression.js' ) );
        register( AndExpression );
        register( CondExpression );
        register( NotExpression );
        register( OrExpression);
    };
    var registerI18n = function(){
        //register( require( './i18n/trCurrencyExpression.js' ) );
        //register( require( './i18n/trDateTimeExpression.js' ) );
        //register( require( './i18n/trNumberExpression.js' ) );
        //register( require( './i18n/trStringExpression.js' ) );
        register( TrCurrencyExpression );
        register( TrDateTimeExpression );
        register( TrNumberExpression );
        register( TrStringExpression );

    };
    var registerScripting = function(){
        //register( require( './scripting/javascriptExpression.js' ) );
        //register( require( './scripting/queryExpression.js' ) );
        register( JavascriptExpression );
        register( QueryExpression );
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
            if ( string.indexOf( prefix ) === 0 ) {
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
        
        if ( effectiveToken.charAt( 0 ) === '(' ){
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
        unregister: unregister,
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
