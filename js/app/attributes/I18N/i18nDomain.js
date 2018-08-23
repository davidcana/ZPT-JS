/*
    I18NDomain class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );
var $ = require( 'jquery' );

var I18NDomain = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var process = function( scope, node ){
        
        var i18nList = [];
        
        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            var i18n = expression.evaluate( scope );
            
            if ( ! i18n ){
                throw 'Null value evaluating i18n domain expression: ' + string;    
            }
            
            if ( $.isArray( i18n ) ){
                i18nList = i18nList.concat( i18n );
            } else {
                i18nList.push( i18n );
            }
        }
        
        // Add the domains defined previously
        var previousI18nList = scope.get( context.getConf().i18nDomainVarName );
        if ( previousI18nList ) {
            i18nList = i18nList.concat( previousI18nList );
        }
        
        // Add i18nDomainVarName to scope
        scope.set( context.getConf().i18nDomainVarName, i18nList, false );
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

I18NDomain.id = 'i18n:domain';

I18NDomain.build = function( string ) {
    
    if ( ! string ){
        return null;
    }
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    var i18nList = [];

    // Add the domains in this tag
    var tokens = new ExpressionTokenizer( 
            string, 
            context.getConf().domainDelimiter, 
            true );

    while ( tokens.hasMoreTokens() ) {
        i18nList.push( 
            expressionBuilder.build( tokens.nextToken().trim() ) );
    }

    return new I18NDomain( string, i18nList );
};

module.exports = I18NDomain;