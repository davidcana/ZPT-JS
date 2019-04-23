/* 
    Class Scope 
*/
"use strict";

var context = require( '../context.js' );
var $ = require( 'jquery' );

var Scope = function( _dictionary, addCommonVars ) {
    
    this.dictionary = _dictionary;
    this.vars = {};
    this.changesStack = [];
    this.nocallVars = {};
    
    if ( addCommonVars ){
        this.setCommonVars();
    }
};

Scope.prototype.setCommonVars = function(){
    
    // Register window object if it exists
    if ( window ){
        this.setVar( context.getConf().windowVarName, window );
    }

    // Register context
    this.setVar( context.getConf().contextVarName, context );
};

Scope.prototype.startElement = function(){
    
    var vars = {
        varsToUnset : [],
        varsToSet : {}
    };

    this.changesStack.push( vars );

    return vars;
};

Scope.prototype.currentVars = function(){
    return this.changesStack[ this.changesStack.length - 1 ];
};

Scope.prototype.setVar = function( name, value ) {
    this.vars[ name ] = value;
};

Scope.prototype.getWithoutEvaluating = function( name ) {

    var valueFromVars = this.vars[ name ];
    return valueFromVars !== undefined? valueFromVars: this.dictionary[ name ];
};

Scope.prototype.get = function( name ) {

    var value = this.getWithoutEvaluating( name );
    
    if ( ! this.nocallVars[ name ] ){
        return value;
    }
    
    return value && $.isFunction( value.evaluate )?
        value.evaluate( this ): 
        'Error evaluating property "' + name + '": ' + value;
};

Scope.prototype.unset = function( name ) {
    delete this.vars[ name ];
};

Scope.prototype.endElement = function ( ) {

    var vars = this.changesStack.pop(); 

    var varsToUnset = vars.varsToUnset;
    var varsToSet = vars.varsToSet; 

    for ( var i = 0; i < varsToUnset.length; ++i ){
        this.unset( varsToUnset[ i ] );
    }

    for ( var name in varsToSet ){
        var value = varsToSet[ name ];
        this.setVar( name, value );
    }
};

Scope.prototype.set = function ( name, value, isGlobal, nocall ) {
    
    if ( ! isGlobal ){

        // Local vars
        var vars = this.currentVars();
        var currentValue = this.getWithoutEvaluating( name );

        if ( currentValue != null ){
            vars.varsToSet[ name ] = currentValue;

        } else {
            vars.varsToUnset.push( name );
        }
    }

    // Common to global and local vars
    this.setVar( name, value );
    
    // Add to nocallVars if needed
    if ( nocall ){
        this.nocallVars[ name ] = true;
    }
};

module.exports = Scope;
