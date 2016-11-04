(function ( $ ) {
 
    $.fn.zpt = function( options ) {
        "use strict";
        
        var defaults = {
            dictionary: {},
            callback: undefined,
            notRemoveGeneratedTags: false
        };
    
        var settings = $.extend( {}, defaults, options );
        settings.root = this[0];
        
        ZPT.run( settings );

        return this;
    };
 
}( jQuery )); 
