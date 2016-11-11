/* 
    Class Scope 
    External dependencies: None
*/
module.exports = function( obj ) {
    "use strict";
    
    var Resolver = require( './resolver.js' );
    
    // Create a duplicate object which we can add properties to without affecting the original
    var wrapper = function() {};
    wrapper.prototype = obj;
    obj = new wrapper();
    
    var globals = obj;
    var varsStack = [];
    var resolver = new Resolver();
    
    var getResolver = function( ) {
        return resolver;
    };
    
    var startElement = function( ) {
        
        var vars = {
            varsToUnset : [],
            varsToSet : {}
        };
        
        varsStack.push( vars );
        
        return vars;
    };
    
    var currentVars = function( ){
        return varsStack[ varsStack.length - 1 ];
    };
    
    var setLocal = function( name, value, isGlobal ) {
        globals[ name ] = value;
    };
    
    var get = function( name ) {
        return globals[ name ];
    };
    
    var unset = function( name ) {
        delete globals[ name ];
    };
     
    var endElement = function ( ) {
        
        var vars = varsStack.pop(); 
        
        var varsToUnset = vars.varsToUnset;
        var varsToSet = vars.varsToSet; 
        
        for ( var i = 0; i < varsToUnset.length; ++i ){
            var name = varsToUnset[ i ];
            unset( name );
        }
        
        for ( name in varsToSet ){
            var value = varsToSet[ name ];
            setLocal( name, value );
        }
    };
    
    var set = function ( name, value, isGlobal ) {
        
        if ( ! isGlobal ){
            
            // Local vars
            var vars = currentVars();
            var currentValue = get( name );
            
            if ( currentValue != null ){
                vars.varsToSet[ name ] = currentValue;
                
            } else {
                vars.varsToUnset.push( name );
            }
        }
        
        // Common to global and local vars
        setLocal( name, value );
    };
    
    return {
        getResolver: getResolver,
        startElement: startElement,
        get: get,
        unset: unset,
        endElement: endElement,
        set: set
    };
};