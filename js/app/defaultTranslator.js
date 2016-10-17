/* DefaultTranslator singleton class */
var defaultTranslator = (function() {
    
    var createI18nBundle = function( resources ){
        return new i18nBundle( resources );
    };
    
    var tr = function ( i18nList, id, params ){
        
        if ( i18nList ) {
            
            var length = i18nList.length;
            
            if ( ! length ){
                return "No I18n instance defined!";
            }
            
            for ( var i = 0; i < length; i++ ) {
                i18n = i18nList[ i ];
                if ( i18n.exists( id ) ){
                    return i18n.tr( id, params );
                }
            }
        }
        
        return "I18n resource '" + id + "' not found!";
    };
    
    return {
        createI18nBundle: createI18nBundle,
        tr: tr
    };
})();

/* I18nBundle class */
var I18nBundle = function( res ) {
    var resources = res;
    var cache = {};
    
    var getI18n = function( languageId ) {
        
        var result = cache[ languageId ];
        
        if ( ! result ){
            result = new I18n( resources[ languageId ] );
            cache[ languageId ] = result;
        }
        
        return result;
    };
    
    return {
        getI18n: getI18n
    };
};

/* I18n class */
var I18n = function( res ) {
    var resources = res;
    
    var exists = function( id ) {
        return resources[ id ] != undefined;
    };
    
    var tr = function( id, params ) {
        return resources[ id ];
    };
    
    return {
        tr: tr
    };
};
