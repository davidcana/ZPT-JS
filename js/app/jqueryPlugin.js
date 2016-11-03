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
        /*
        zpt.run(
            this[0], 
            settings.dictionary, 
            settings.callback, 
            settings.notRemoveGeneratedTags
        );*/

        return this;
    };
 
}( jQuery )); 
