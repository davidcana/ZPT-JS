/* 
    I18n class 
    External dependencies: Intl (supported by recent browsers) and MessageFormat
*/
module.exports = function( languageId, res ) {
    "use strict";
    
    var MessageFormat = require( 'messageformat' );
    var context = require( '../context.js' );
    
    var resources = res;
    var mf = new MessageFormat( languageId );
    var cache = {};
    var numberFormatCache = {};
    var dateTimeFormatCache = {};
    /*var CONF_RESOURCE_ID = '/CONF/';*/
    var CONF_RESOURCE_ID = context.getConf().i18nConfResourceId;
    
    var getLanguage = function(){
        //return resources[ context.getConf().i18nConfResourceId ].language;
        return resources[ CONF_RESOURCE_ID ].language;
    };
    
    var getLocale = function(){
        //return resources[ context.getConf().i18nConfResourceId ].locale;
        return resources[ CONF_RESOURCE_ID ].locale;
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
        
        throw 'I18n format type not supported: ' + format;
    };
    
    var trString = function( id, params ) {
        
        var mfunc = cache[ id ];
        
        if ( ! mfunc ){
            mfunc = mf.compile( resources[ id ] );
            cache[ id ] = mfunc;
        }
        
        return mfunc( params );
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
        
        params.style = 'currency';
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
        getLanguage: getLanguage,
        getLocale: getLocale,
        exists: exists,
        tr: tr
    };
};
