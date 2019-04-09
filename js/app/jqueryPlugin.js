"use strict";

var $ = require( 'jquery' );
var zpt = require( './main.js' );

(function ( $ ) {
 
    $.fn.zpt = function( userOptions ) {
        
        var options = userOptions || {};
        options.root = this[0];
        zpt.run( options );

        return this;
    };

}( $ )); 
