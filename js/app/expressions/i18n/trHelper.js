/* 
    trHelper singleton class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../expressionTokenizer.js' );
var i18nHelper = require( '../../i18n/i18nHelper.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var expressionsUtils = require( '../expressionsUtils.js' );
var VariableExpression = require( '../path/variableExpression.js' );

module.exports = (function() {
    
    var build = function( string, tag, minElements, maxElements, useSubformat ) {
        var expressionBuilder = require( '../expressionBuilder.js' );
        
        if ( string.length == 0 ) {
            throw tag + ' expression void.';
        }

        var segments = new ExpressionTokenizer( 
                string.trim(), 
                context.getConf().expressionDelimiter, 
                false );
        
        // Check number of tokens
        var count = segments.countTokens();
        if ( count < minElements ) {
            throw 'Too few elements in ' + tag + ' expression (minimum is ' + minElements 
                    + ', ' + count + ' present): ' + expression;
        }
        if ( count > maxElements ) {
            throw 'Too many elements in ' + tag + ' expression (maximum is ' + maxElements 
                    + ', ' + count + ' present):' + expression;
        }
        
        // Get tokens
        var subformat = useSubformat? 
                expressionBuilder.build( segments.nextToken().trim() ): 
                undefined;
        var expression = expressionBuilder.build( 
                segments.nextToken().trim() );
        var argsSegment = segments.hasMoreTokens()? 
                segments.nextToken().trim(): 
                undefined;
        
        return {
            expression: expression,
            argsExpressions: buildI18nArgs( argsSegment ),
            subformat: subformat
        };
    };
    
    var buildI18nArgs = function( segment ){
        var expressionBuilder = require( '../expressionBuilder.js' );
        
        var args = {};
        if ( ! segment ){
            return args;
        }
        var tokens = new ExpressionTokenizer( 
                segment, 
                context.getConf().i18nOptionsDelimiter, 
                true );
        while ( tokens.hasMoreTokens() ) {
            var token = tokens.nextToken().trim();
            var argsTokens = new ExpressionTokenizer( 
                    token, 
                    context.getConf().inI18nOptionsDelimiter, 
                    true );
            if ( argsTokens.countTokens() != 2 ) {
                throw '2 elements are needed in i18n expression.';
            }
            
            var argKey = argsTokens.nextToken().trim();
            var argExpression = expressionBuilder.build( 
                    argsTokens.nextToken().trim() );
            args[ argKey ] = argExpression;
        }
        return args;
    };
    
    var evaluateI18nArgs = function( scope, i18nArgs ){
        var values = {};
        
        for ( var argKey in i18nArgs ) {
            var argExpression = i18nArgs[ argKey ];
            var argValue = evaluateHelper.evaluateToNotNull( scope, argExpression );
            values[ argKey ] = argValue;
        }
        
        return values;
    };
    
    var evaluate = function( scope, valueExpression, argsExpressions, format, subformat ) {
        var argValues = evaluateI18nArgs( scope, argsExpressions );
        var subformatEvaluated = 
                subformat? 
                evaluateHelper.evaluateToNotNull( scope, subformat ): 
                undefined;
        var valueEvaluated = evaluateHelper.evaluateToNotNull( scope, valueExpression );
        var evaluated = translate( 
                scope, 
                valueEvaluated, 
                argValues, 
                format, 
                subformatEvaluated );
        
        return evaluated;
    };
    
    var translate = function( scope, id, i18nArgs, format, subformat ){
        
        var i18nList = scope.get( context.getConf().i18nDomainVarName );
        var language = scope.get( context.getConf().i18nLanguageVarName );
        return i18nHelper.tr( 
            i18nList, 
            id, 
            i18nArgs, 
            format, 
            subformat,
            language );
    };
    
    var dependsOn = function( scope, expression, argsExpressions ){
        
        return expressionsUtils.buildDependsOnList( 
            scope, 
            expression, 
            argsExpressions, 
            new VariableExpression( context.getConf().i18nDomainVarName ),
            new VariableExpression( context.getConf().i18nLanguageVarName )
        );
    };
    
    return {
        build: build,
        evaluate: evaluate,
        dependsOn: dependsOn
    };
})();
