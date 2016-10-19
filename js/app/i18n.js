/* I18n class using MessageFormat */
var I18n = function( languageId, res ) {
    var resources = res;
    var mf = new MessageFormat( languageId );
    var cache = {};
    
    var exists = function( id ) {
        return resources[ id ] != undefined;
    };
    
    var tr = function( id, params ) {
        
        var mfunc = cache[ id ];
        
        if ( ! mfunc ){
            mfunc = mf.compile( resources[ id ] );
            cache[ id ] = mfunc;
        }
        
        return mfunc( params );
        //return resources[ id ];
    };
    
    return {
        exists: exists,
        tr: tr
    };
};
