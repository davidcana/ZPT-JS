/*
    TALProps class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );
var $ = require( 'jquery' );

var TALProps = function( _string, _propsItems ) {
    
    var string = _string;
    var propsItems = _propsItems;
    
    var process = function( scope, autoDefineHelper ){

        putVariables( scope, autoDefineHelper );

        return processPropsItems( scope );
    };
    
    var putVariables = function( scope, autoDefineHelper ) {
        
        // Add strictModeVarName to the autoDefineHelper if needed
        var strictModeVarName = context.getConf().strictModeVarName;
        if ( true !== scope.get( strictModeVarName ) ){
            autoDefineHelper.put( strictModeVarName, 'true' );
        }
        
        // Build declared and required
        var declaredVarsVarName = context.getConf().declaredVarsVarName;
        var declared = scope.get( declaredVarsVarName ) || [];
        for ( var i = 0; i < propsItems.length; i++ ) {
            var propsItem = propsItems[ i ];
            declared.push( propsItem.name );
        }
        
        // Add declaredVarsVarName to the autoDefineHelper
        autoDefineHelper.put( 
            declaredVarsVarName, 
            expressionsUtils.buildList( declared, true )
        );
    };
    
    var processPropsItems = function( scope ) {
        
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
            errorsArray = errorsArray.concat( errors );
        }

        processErrorsArray( errorsArray );

        return errorsArray.length == 0;
    }

    var checkPropsItem = function( scope, name, type, required, defaultValueString, defaultValueExpression ) {
        
        var errorsArray = [];
        
        var value = scope.get( name );
        
        // Set default value if needed
        if ( value === undefined && defaultValueExpression !== undefined ){
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
        
        if ( ! expectedType ){
            return;
        }
        
        var realType = getTypeOf( value );
        return realType === expectedType.toLowerCase()? 
            false: 
            'Expected value type (' + expectedType.toLowerCase() + ') of ' + name + ' property does not match type (' + realType + '), value is "' + value + '".'
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
        return temp === 'object'? 
            value.constructor.name.toLowerCase(): 
            temp;
    };
    
    var checkRequired = function( name, required, value ) {
        
        return true === required && value === undefined? 
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
        
        context.errorFunction( errorsArray );
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
        
        var name = undefined;
        var type = undefined;
        var defaultValueString = undefined;
        var required = false;
        var state = 1;
        while ( inPropTokens.hasMoreTokens() ){
            var currentToken = inPropTokens.nextToken();
            if ( TALProps.tokenIsRequired( currentToken ) ){
                required = true;
                continue;
            }
            switch ( state ) {
                case 1:
                    name = currentToken;
                    break;
                case 2:
                    type = currentToken;
                    break;
                case 3:
                    defaultValueString = currentToken;
                    break;
                default:
                    throw 'Too many arguments in talProps item: ' + string.trim();
            }
            ++state;
        }
        
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

TALProps.tokenIsRequired = function( token ) {
    return "required" === token.toLowerCase();
};

module.exports = TALProps;
