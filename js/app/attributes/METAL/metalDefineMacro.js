/*
    METALDefineMacro class
*/
"use strict";

var METALDefineMacro = function( nameToApply ) {
    
    var name = nameToApply;
    
    var process = function( scope, node ){
        
        // Hide macro definitions
        node.style.display = 'none';

        return false;
    };

    var toString = function(){
        return "METALDefineMacro: " + name;
    };
    
    return {
        process: process,
        toString: toString
    };
};

METALDefineMacro.id = 'metal:define-macro';

METALDefineMacro.build = function( string ) {
    return new METALDefineMacro( string.trim() );
};

module.exports = METALDefineMacro;