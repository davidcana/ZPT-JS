"use strict";

var $ = require( 'jquery' );
var zpt = require( './main.js' );

(function ( $ ) {
 
    $.fn.zpt = function( userOptions ) {
        
        var options = userOptions || {};
        
        if ( options.command == 'partialRender' ){
            options.target = this[0];
        } else {
            options.root = this[0];            
        }

        zpt.run( options );

        return this;
    };

}( $ )); 
