/* 
    evaluateHelper singleton class
*/
"use strict";

var context = require( '../context.js' );

module.exports = (function() {
    
    var evaluateToNotNull = function( scope, expression ) {
        var evaluated = expression.evaluate( scope );
        return evaluated == undefined? 'undefined': evaluated;
    };
    
    var evaluateBoolean = function( scope, expression ) {
        var evaluated = expression.evaluate( scope );
        
        if ( evaluated === undefined
            || evaluated == null
            || evaluated == 'false' 
            || evaluated == false 
            || evaluated == 0 ){
            return false;
        }
        
        return true;
    };
    
    var evaluateNumber = function( scope, expression, errorMessageToApply ) {
        var evaluated = expression.evaluate( scope );
        
        if ( ! isNumber( evaluated ) ){
            var errorMessage = 
                errorMessageToApply? 
                errorMessageToApply: 
                'Expression "' + expression + '" is not a valid number.'
            throw errorMessage;
        }
        
        return evaluated;
    };
    
    var isNumber = function( string ){
        return ! isNaN( parseFloat( string ) ) || ! isFinite( string );
    };
    /*
    var evaluateInteger = function( scope, expression, errorMessageToApply ) {
        var evaluated = expression.evaluate( scope );
        
        if ( ! isInteger( evaluated ) ){
            var errorMessage = 
                errorMessageToApply? 
                errorMessageToApply: 
                'Expression "' + expression + '" is not a valid integer.'
            throw errorMessage;
        }
        
        return evaluated;
    };*/
    /*
    var isInteger = function( string ){
        return ! isNaN( parseInt( string ) ) || ! isFinite( string );
    };*/
    
    var evaluateExpressionList = function ( list, scope ){
        
        var result = [];
        
        for ( var i = 0; i < list.length; i++ ) {
            var expression = list[ i ];
            result.push( expression.evaluate( scope ) );
        }
        
        return result;
    };
    
    var isDefault = function( value ){
        return value === context.getConf().defaultVarValue;
    };
    var isNothing = function( value ){
        return value === context.getConf().nothingVarValue;
    };
    
    return {
        evaluateToNotNull: evaluateToNotNull,
        evaluateBoolean: evaluateBoolean,
        evaluateNumber: evaluateNumber,
        //evaluateInteger: evaluateInteger,
        isNumber: isNumber,
        //isInteger: isInteger,
        evaluateExpressionList: evaluateExpressionList,
        isDefault: isDefault,
        isNothing: isNothing
    };
})();
