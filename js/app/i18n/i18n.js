/* 
    I18n class 
    External dependencies: Intl (supported by recent browsers) and MessageFormat
*/
    
//import * as MessageFormat from '../../../node_modules/@messageformat/core/messageformat.js';
import MessageFormat from '../../../lib/messageformat-esm.js';
import { context } from '../context.js';
import { utils } from '../utils.js';

export const I18n = function( languageId, res ) {

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
        return resources[ id ] !== undefined;
    };
    
    var tr = function( id, params, format, subformat ) {
        
        switch ( format ) {
        case 'string':
            return trString( id, params );
        case 'number':
            return trNumber( id, params );
        case 'currency':
            return trCurrency( id, params, subformat );
        case 'datetime':
            return trDateTime( id, params );
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
    
    var getSource = function( params ){
        
        return params && utils.isFunction( params.toSource )?
            params.toSource():
            '';
    };
    
    var trNumber = function( value, params ) {
        
        var source = getSource( params );
        var numberFormat = numberFormatCache[ source ];
        
        if ( ! numberFormat ){
            numberFormat = new Intl.NumberFormat( getLocale(), params );
            numberFormatCache[ source ] = numberFormat;
        }
        
        return numberFormat.format( value );
    };
    
    var trCurrency = function( value, params, theCurrency ) {
        
        params.style = 'currency';
        params.currency = theCurrency;
        
        return trNumber( value, params );
    };
    
    var trDateTime = function( value, params ) {
        
        var source = getSource( params );
        var dateTimeFormat = dateTimeFormatCache[ source ];
        
        if ( ! dateTimeFormat ){
            dateTimeFormat = new Intl.DateTimeFormat( getLocale(), params );
            dateTimeFormatCache[ source ] = dateTimeFormat;
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
