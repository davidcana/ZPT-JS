"use strict";

var $ = require( 'jquery' );
var zpt = require( './main.js' );

(function ( $ ) {
 
    $.fn.zpt = function( options ) {
        
        var defaults = {
            callback: undefined,
            notRemoveGeneratedTags: false
        };
    
        var settings = $.extend( {}, defaults, options );
        settings.root = this[0];
        
        zpt.run( settings );

        return this;
    };
 
}( $ )); 
