/* 
    Class Scope 
*/
"use strict";

var context = require( './context.js' );

var Scope = function( dictionary ) {
    
    // Create a duplicate object which we can add properties to without affecting the original
    var wrapper = function() {};
    wrapper.prototype = dictionary;
    dictionary = new wrapper();
    
    this.globals = dictionary;
    this.varsStack = [];
    
    // Register window object if it exists
    if ( window ){
        this.setLocal( context.getConf().windowVarName, window );
    }
    
    // Register context
    this.setLocal( context.getConf().contextVarName, context );
};

Scope.prototype.startElement = function(){
    
    var vars = {
        varsToUnset : [],
        varsToSet : {}
    };

    this.varsStack.push( vars );

    return vars;
};

Scope.prototype.currentVars = function(){
    return this.varsStack[ this.varsStack.length - 1 ];
};

Scope.prototype.setLocal = function( name, value ) {
    this.globals[ name ] = value;
};

Scope.prototype.get = function( name ) {
    return this.globals[ name ];
};

Scope.prototype.unset = function( name ) {
    delete this.globals[ name ];
};

Scope.prototype.endElement = function ( ) {

    var vars = this.varsStack.pop(); 

    var varsToUnset = vars.varsToUnset;
    var varsToSet = vars.varsToSet; 

    for ( var i = 0; i < varsToUnset.length; ++i ){
        this.unset( varsToUnset[ i ] );
    }

    for ( var name in varsToSet ){
        var value = varsToSet[ name ];
        this.setLocal( name, value );
    }
};

Scope.prototype.set = function ( name, value, isGlobal ) {

    if ( ! isGlobal ){

        // Local vars
        var vars = this.currentVars();
        var currentValue = this.get( name );

        if ( currentValue != null ){
            vars.varsToSet[ name ] = currentValue;

        } else {
            vars.varsToUnset.push( name );
        }
    }

    // Common to global and local vars
    this.setLocal( name, value );
};

module.exports = Scope;
