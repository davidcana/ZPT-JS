/* translator singleton class */
var ZPT = ZPT || {};

ZPT.translator = (function() {
    /*
    var createI18nBundle = function( resources ){
        return new I18nBundle( resources );
    };*/
    
    var tr = function ( i18nList, id, params, format, subformat ){
        
        if ( ! i18nList ) {
            return "No I18n instance defined!";
        }
            
        var length = i18nList.length;
        if ( ! length ){
            return "Void I18n list!";
        }

        for ( var i = 0; i < length; i++ ) {
            i18n = i18nList[ i ];
            if ( format !== 'string' || i18n.exists( id ) ){
                return i18n.tr( id, params, format, subformat );
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
    };
    
    return {
        /*createI18nBundle: createI18nBundle,*/
        tr: tr,
        loadAsync: loadAsync
    };
})();

/* I18nBundle class */
/*
var I18nBundle = function( res ) {
    var resources = res;
    var cache = {};
    
    var getI18n = function( languageId ) {
        
        var result = cache[ languageId ];
        
        if ( ! result ){
            result = new I18n( languageId, resources[ languageId ] );
            cache[ languageId ] = result;
        }
        
        return result;
    };
    
    return {
        getI18n: getI18n
    };
};*/