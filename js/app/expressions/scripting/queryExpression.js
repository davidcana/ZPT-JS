/*
    QueryExpression class
*/

//var context = require( '../../context.js' );
//var expressionsUtils = require( '../expressionsUtils.js' );
import { context } from '../../context.js';
import { expressionsUtils } from '../expressionsUtils.js';
import { expressionBuilder } from '../../expressions/expressionBuilder.js';

export const QueryExpression = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        
        try {
            var evaluated = expression.evaluate( scope );
            var elementList = window.document.querySelectorAll( evaluated );
            
            // elementList with length 1
            if ( elementList.length === 1 ){
                return elementList[ 0 ].innerText;
            }
            
            // elementList with length > 1
            var texts = [];
            for ( var i = 0; i < elementList.length; ++i ){
                texts.push( elementList[ i ].innerText );
            }
            return texts;
            
        } catch ( e ){
            return 'Query expression error in "' + string + '": ' + e;
        }
    };

    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expression );
    };
    
    var toString = function(){
        return string;
    };

    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

QueryExpression.removePrefix = true;
QueryExpression.getPrefix = function() {
    return context.getConf().queryExpression;
};
QueryExpression.getId = QueryExpression.getPrefix;

QueryExpression.build = function( string ) {
    //var expressionBuilder = require( '../expressionBuilder.js' );
    
    var expression = expressionBuilder.build( string );
    
    return new QueryExpression( string, expression );
};

//module.exports = QueryExpression;
