/*
    AddExpression class
*/
//var context = require( '../../context.js' );
//var arithmethicHelper = require( './arithmethicHelper.js' );
//var expressionsUtils = require( '../expressionsUtils.js' );
import { context } from '../../context.js';
import { arithmethicHelper } from './arithmethicHelper.js';
import { expressionsUtils } from '../expressionsUtils.js';

export const AddExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
            scope,
            expressionList, 
            AddExpression.mathOperation, 
            function( total, value ){
                return total + value;
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

AddExpression.removePrefix = true;
AddExpression.getPrefix = function() {
    return context.getConf().addExpression;
};
AddExpression.mathOperation = 'add';
AddExpression.getId = AddExpression.mathOperation;

AddExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            AddExpression.mathOperation 
    );

    return new AddExpression( string, expressionList );
};

//module.exports = AddExpression;
