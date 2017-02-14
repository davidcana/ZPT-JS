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

    return {
        process: process
    };
};

METALDefineMacro.id = 'metal:define-macro';

METALDefineMacro.build = function( string ) {
    return new METALDefineMacro( string.trim() );
}

module.exports = METALDefineMacro;