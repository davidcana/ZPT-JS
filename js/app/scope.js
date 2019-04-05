/* 
    Class Scope 
*/
"use strict";

var context = require( './context.js' );

module.exports = function( obj ) {
    
    // Create a duplicate object which we can add properties to without affecting the original
    var wrapper = function() {};
    wrapper.prototype = obj;
    obj = new wrapper();
    
    this.globals = obj;
    this.varsStack = [];
    
    this.startElement = function( ) {
        
        var vars = {
            varsToUnset : [],
            varsToSet : {}
        };
        
        this.varsStack.push( vars );
        
        return vars;
    };
    
    this.currentVars = function( ){
        return this.varsStack[ this.varsStack.length - 1 ];
    };
    
    this.setLocal = function( name, value ) {
        this.globals[ name ] = value;
    };
    
    this.get = function( name ) {
        return this.globals[ name ];
    };
    
    this.unset = function( name ) {
        delete this.globals[ name ];
    };
     
    this.endElement = function ( ) {
        
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
    
    this.set = function ( name, value, isGlobal ) {
        
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
    
    // Register window object if it exists
    if ( window ){
        this.setLocal( context.getConf().windowVarName, window );
    }
    
    // Register context
    this.setLocal( context.getConf().contextVarName, context );
    
    return this;
    /*
    return {
        startElement: startElement,
        endElement: endElement,
        get: get,
        set: set
        //unset: unset
    };
    */
};