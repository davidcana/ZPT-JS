/*
    TALDeclare class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );

var TALDeclare = function( _string, _declareItems ) {
    
    var string = _string;
    var declareItems = _declareItems;
    
    var process = function( scope, autoDefineHelper ){

        putVariables( scope, autoDefineHelper );

        return processDeclareItems( scope );
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
        for ( var i = 0; i < declareItems.length; i++ ) {
            var declareItem = declareItems[ i ];
            declared.push( declareItem.name );
        }
        
        // Add declaredVarsVarName to the autoDefineHelper
        autoDefineHelper.put( 
            declaredVarsVarName, 
            expressionsUtils.buildList( declared, true )
        );
    };
    
    var processDeclareItems = function( scope ) {
        
        var errorsArray = [];

        for ( var i = 0; i < declareItems.length; i++ ) {
            var declareItem = declareItems[ i ];
            var errors = checkDeclareItem(
                scope,
                declareItem.name,
                declareItem.type,
                declareItem.required,
                declareItem.defaultValueString,
                declareItem.defaultValueExpression
            );
            errorsArray = errorsArray.concat( errors );
        }

        processErrorsArray( errorsArray );

        return errorsArray.length === 0;
    };

    var checkDeclareItem = function( scope, name, type, required, defaultValueString, defaultValueExpression ) {
        
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
            'Expected value type (' + expectedType.toLowerCase() + ') of ' + name + ' property does not match type (' + realType + '), value is "' + value + '".';
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

        if ( errorsArray.length === 0 ){
            return;
        }
        
        throw errorsArray;
    };
    
    var dependsOn = function(){
        return [];
    };
    
    var update = function(){
        // Nothing to do
    };
    
    var toString = function(){
        return "TALDeclare: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: TALDeclare.id
    };
};

TALDeclare.id = 'tal:declare';

TALDeclare.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );

    var declareItems = [];
    var omitTypes = [ 'undefined', 'null' ];
    
    var tokens = new ExpressionTokenizer( 
        string.trim(), 
        context.getConf().declareDelimiter, 
        true 
    );

    while ( tokens.hasMoreTokens() ) {
        
        var inPropTokens = new ExpressionTokenizer( 
            tokens.nextToken().trim(), 
            context.getConf().inDeclareDelimiter, 
            true 
        );
        
        var name = undefined;
        var type = undefined;
        var defaultValueString = undefined;
        var required = false;
        var state = 1;
        while ( inPropTokens.hasMoreTokens() ){
            var currentToken = inPropTokens.nextToken();
            if ( TALDeclare.tokenIsRequired( currentToken ) ){
                required = true;
                continue;
            }
            switch ( state ) {
                case 1:
                    name = currentToken;
                    break;
                case 2:
                    if ( -1 === omitTypes.indexOf( currentToken.toLowerCase() ) ){
                        type = currentToken;   
                    }
                    break;
                case 3:
                    defaultValueString = currentToken;
                    break;
                default:
                    throw 'Too many arguments in talDeclare item: ' + string.trim();
            }
            ++state;
        }
        
        // The name is the only required element
        if ( ! name ){
            continue;
        }
        
        declareItems.push({
            name: name,
            type: type,
            required: required,
            defaultValueString: defaultValueString,
            defaultValueExpression: defaultValueString == undefined? undefined: expressionBuilder.build( defaultValueString )
        });
    }

    return new TALDeclare( string, declareItems );
};

TALDeclare.tokenIsRequired = function( token ) {
    return "required" === token.toLowerCase();
};

module.exports = TALDeclare;
