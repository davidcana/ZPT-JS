/* 
    i18nHelper singleton class 
*/
module.exports = (function() {
    "use strict";
    
    var $ = require( 'jquery' );
    
    var tr = function ( i18nList, id, params, format, subformat, language ){
        
        if ( ! i18nList ) {
            return "No I18n instance defined!";
        }
            
        var length = i18nList.length;
        if ( ! length ){
            return "Void I18n list!";
        }

        for ( var i = 0; i < length; i++ ) {
            var i18n = i18nList[ i ];
            if ( format !== 'string' || i18n.exists( id ) ){
                return i18n.tr( id, params, format, subformat, language );
            }
        }
        
        return "I18n resource '" + id + "' not found!";
    };
    
    var loadAsync = function( remoteList, deferred ){
        loadAsyncItem( 
            {}, 
            deferred, 
            remoteList, 
            remoteList.length - 1 );
    };
    
    var loadAsyncItem = function( map, deferred, remoteList, currentIndex ){
        var url = remoteList[ currentIndex ];
        $.getJSON( 
            url,
            function( data ) {
                map[ url ] = data;
                if ( currentIndex > 0 ){
                    loadAsyncItem( 
                        map, 
                        deferred, 
                        remoteList, 
                        --currentIndex );
                } else {
                    deferred( map );
                }
            });
    };
    /*
    var loadAsyncItem = function( map, deferred, remoteList, currentIndex ){
        var url = remoteList[ currentIndex ];
        $.getJSON( url )
            .success(function( data ) {
                map[ url ] = data;
                if ( currentIndex > 0 ){
                    loadAsyncItem( 
                        map, 
                        deferred, 
                        remoteList, 
                        --currentIndex );
                } else {
                    deferred( map );
                }
            });
    };*/
    
    return {
        tr: tr,
        loadAsync: loadAsync
    };
})();
