/* I18n class using MessageFormat and Intl */
var ZPT = ZPT || {};

ZPT.I18n = function( languageId, res ) {
    "use strict";
    
    var resources = res;
    var mf = new MessageFormat( languageId );
    var cache = {};
    var numberFormatCache = {};
    var dateTimeFormatCache = {};
    
    var getLanguage = function(){
        return resources[ '/CONF/' ].language;
    };
    
    var getLocale = function(){
        return resources[ '/CONF/' ].locale;
    };
    
    var exists = function( id ) {
        return resources[ id ] != undefined;
    };
    
    var tr = function( id, params, format, subformat ) {
        
        switch ( format ) {
        case 'string':
            return trString( id, params );
            break;
        case 'number':
            return trNumber( id, params );
            break;
        case 'currency':
            return trCurrency( id, params, subformat );
            break;
        case 'datetime':
            return trDateTime( id, params );
            break;
        } 
        
        throw 'Format type not supported: ' + format;
    };
    
    var trString = function( id, params ) {
        
        var mfunc = cache[ id ];
        
        if ( ! mfunc ){
            mfunc = mf.compile( resources[ id ] );
            cache[ id ] = mfunc;
        }
        
        return mfunc( params );
        //return resources[ id ];
    };
    
    var trNumber = function( value, params ) {
        
        var numberFormat = numberFormatCache[ params.toSource() ];
        
        if ( ! numberFormat ){
            numberFormat = new Intl.NumberFormat( getLocale(), params );
            numberFormatCache[ params.toSource() ] = numberFormat;
        }
        
        return numberFormat.format( value );
    };
    
    var trCurrency = function( value, params, theCurrency ) {
        
        params.style = "currency";
        params.currency = theCurrency;
        
        return trNumber( value, params );
    };
    
    var trDateTime = function( value, params ) {
        
        var dateTimeFormat = dateTimeFormatCache[ params.toSource() ];
        
        if ( ! dateTimeFormat ){
            dateTimeFormat = new Intl.DateTimeFormat( getLocale(), params );
            dateTimeFormatCache[ params.toSource() ] = dateTimeFormat;
        }
        
        return dateTimeFormat.format( value );
    };
    
    return {
        exists: exists,
        tr: tr
    };
};
