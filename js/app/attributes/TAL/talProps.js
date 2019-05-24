/*
    TALProps class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var $ = require( 'jquery' );

var TALProps = function( _string, _propsItems ) {
    
    var string = _string;
    var propsItems = _propsItems;
    
    var process = function( scope ){
        
        var errorsArray = [];
        
        for ( var i = 0; i < propsItems.length; i++ ) {
            var propsItem = propsItems[ i ];
            var errors = checkPropsItem(
                scope,
                propsItem.name,
                propsItem.type,
                propsItem.required,
                propsItem.defaultValueString,
                propsItem.defaultValueExpression
            );
            errorsArray.concat( errors );
        }
        
        processErrorsArray( errorsArray );
    };

    var checkPropsItem = function( scope, name, type, required, defaultValueString, defaultValueExpression ) {
        
        var errorsArray = [];
        
        var value = scope.get( name );
        
        // Set default value if needed
        if ( value === undefined || defaultValueExpression === undefined ){
            var setDefaultValueError = setDefaultValue( scope, name, type, defaultValueString, defaultValueExpression );
            if ( setDefaultValueError ){
                errorsArray.push( setDefaultValueError );
                return errorsArray;
            }
            value = scope.get( name );
        }
        
        // Check type
        var typeCheckError = checkType( name, type, value );
        if ( typeCheckError ){
            errorsArray.push( typeCheckError );
        }
        
        // Check required
        var requiredCheckError = checkRequired( name, required, value );
        if ( requiredCheckError ){
            errorsArray.push( requiredCheckError );
        }
        
        return errorsArray;
    };
    
    var checkType = function( name, expectedType, value ) {
        
        var realType = getTypeOf( value );
        return realType === expectedType? 
            false: 
            'Expected value type (' + expectedType + ') of ' + name + ' property does not match type (' + realType + '), value is ' + value
    };
    
    /*
        typeOf();                   // undefined
        typeOf(null);               // null
        typeOf(NaN);                // number
        typeOf(5);                  // number
        typeOf([]);                 // array
        typeOf('');                 // string
        typeOf(function () {});     // function
        typeOf(/a/)                 // regexp
        typeOf(new Date())          // date
        typeOf(new Error)           // error
        typeOf(Promise.resolve())   // promise
        typeOf(function *() {})     // generatorfunction
        typeOf(new WeakMap())       // weakmap
        typeOf(new Map())           // map
        typeOf({});                 // object
        typeOf(new MyConstructor()) // MyConstructor
    */
    var getTypeOf = function( value ){
        
        var temp = {}.toString.call( value ).split(' ')[ 1 ].slice( 0, -1 ).toLowerCase();
        return temp === 'object'? temp.constructor.name: temp;
    };
    
    var checkRequired = function( name, required, value ) {
        
        if ( ! required ){
            return;
        }
        
        // Normalize value
        var stringRequired = '' + required;
        stringRequired = stringRequired.toLoweCase();
        if ( stringRequired !== "true" && stringRequired !== "false" ){
            return 'Required must be true or false: ' + name;
        }
        
        return "true" === stringRequired && value === undefined? 
            'Required value must not be undefined: ' + name:
            false;
    };
    
    var setDefaultValue = function( scope, name, type, defaultValueString, defaultValueExpression ) {
        
        try {
            var defaultValue = defaultValueExpression.evaluate( scope );
            scope.set( name, defaultValue );
            return false;
            
        } catch ( e ) {
            return 'Error trying to evaluate default value of field ' + name + ', expression [' + defaultValueString + ']: ' + e;
        }
    };
    
    var processErrorsArray = function( errorsArray ) {

        if ( errorsArray.length == 0 ){
            return;
        }
        
        // Process errors
        alert( 
            errorsArray.join( '\n' ) 
        );
    };
    
    var toString = function(){
        return "TALProps: " + string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

TALProps.id = 'tal:props';

TALProps.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );

    var propsItems = [];
    
    var tokens = new ExpressionTokenizer( 
        string.trim(), 
        context.getConf().propsDelimiter, 
        true 
    );

    while ( tokens.hasMoreTokens() ) {
        
        var inPropTokens = new ExpressionTokenizer( 
            tokens.nextToken().trim(), 
            context.getConf().inPropsDelimiter, 
            true 
        );
        
        var name = inPropTokens.nextTokenIfAny();
        var type = inPropTokens.nextTokenIfAny();
        var required = inPropTokens.nextTokenIfAny();
        var defaultValueString = inPropTokens.nextTokenIfAny();
        
        // The name is the only required element
        if ( ! name ){
            continue;
        }
        
        propsItems.push({
            name: name,
            type: type,
            required: required,
            defaultValueString: defaultValueString,
            defaultValueExpression: defaultValueString == undefined? undefined: expressionBuilder.build( defaultValueString ),
        });
    }

    return new TALProps( string, propsItems );
};

module.exports = TALProps;
