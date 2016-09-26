(function ( $ ) {
 
    $.fn.zpt = function( options ) {
 
        var defaults = {
            dictionary: {},
            callback: undefined,
            notRemoveGeneratedTags: false
        };
    
        var settings = $.extend( {}, defaults, options );
 
        zpt.run(
            this[0], 
            settings.dictionary, 
            settings.callback, 
            settings.notRemoveGeneratedTags
        );

        return this;
    };
 
}( jQuery )); 
