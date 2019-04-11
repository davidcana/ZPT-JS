/* 
    scopeBuilder singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var Scope = require( './scope.js' );

module.exports = (function() {
    
    var build = function( parserOptions, target ) {

        var scope = new Scope( parserOptions.dictionary, true );
        
        if ( parserOptions.command == 'partialRender' ){
            updateForPartialRender( parserOptions, target, scope );
        }
        
        return scope;
    };
    
    var updateForPartialRender = function( parserOptions, target, scope ) {
        
    };
    
    var getRoot = function(){
        
    };
    
    return {
        build: build
    };
})();
