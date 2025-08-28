/*
    DivideExpression class
*/
//var context = require( '../../context.js' );
//var arithmethicHelper = require( './arithmethicHelper.js' );
//var expressionsUtils = require( '../expressionsUtils.js' );
import { context } from '../../context.js';
import { arithmethicHelper } from './arithmethicHelper.js';
import { expressionsUtils } from '../expressionsUtils.js';

export const DivideExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
            scope,
            expressionList, 
            DivideExpression.mathOperation, 
            function( total, value ){
                return total / value;
            } 
        );
    };

    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expressionList );
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

DivideExpression.removePrefix = true;
DivideExpression.getPrefix = function() {
    return context.getConf().divExpression;
};
DivideExpression.mathOperation = 'divide';
DivideExpression.getId = DivideExpression.mathOperation;

DivideExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            DivideExpression.mathOperation 
    );

    return new DivideExpression( string, expressionList );
};

//module.exports = DivideExpression;
