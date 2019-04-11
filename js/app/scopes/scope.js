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
    
    if ( addCommonVars ){
        this.setCommonVars();
    }
};

// Build a deep copy of this instance excluding common vars in dicionary
/*
Scope.prototype.copy = function(){

    // notToCopy must contain all the vars that must not be copied
    var notToCopy = {};
    notToCopy[ context.getConf().windowVarName ] = true;
    notToCopy[ context.getConf().contextVarName ] = true;
    
    // Copy all the dictionary entries not included in notToCopy to newDictionary
    var newDictionary = {};
    for ( var i in this.dictionary ){
        if ( ! notToCopy[ i ] ){
            newDictionary[ i ] = this.dictionary[ i ];
        }
    }
    
    // Create a new instance of Scope with the newDictionary and the current changesStack
    var newScope = new Scope( newDictionary, false );
    newScope.changesStack = $.extend( true, [], this.changesStack );
    
    return newScope;
};
*/
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

Scope.prototype.get = function( name ) {
    
    var valueFromVars = this.vars[ name ];
    return valueFromVars !== undefined? valueFromVars: this.dictionary[ name ];
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
    this.setVar( name, value );
};

Scope.prototype.update = function(){

};

module.exports = Scope;
