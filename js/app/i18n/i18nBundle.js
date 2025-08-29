/* 
    I18nBundle class 
*/

export const I18nBundle = function( ) {
    
    var i18nList = {};
    var first = undefined;

    var add = function( i18n ){
        i18nList[ i18n.getLanguage() ] = i18n;
        if ( ! first ){
            first = i18n;
        }
    };
    
    var exists = function( id ){
        return first.exists( id );
    };
    
    var tr = function( id, params, format, subformat, language ) {
        
        if ( ! language ){
            throw 'Language not defined! Please, use data-iLanguage to define it before trying to translate anything!';
        }
        
        var i18n = i18nList[ language ];
        
        if ( ! i18n ){
            throw 'Language "' + language + '" not found in I18nBundle!';
        }
        
        return i18n.tr( id, params, format, subformat );
    };

    // Init!
    for ( var c = 0; c < arguments.length; c++ ) {
        add( arguments[ c ] );
    }
    
    return {
        add: add,
        exists: exists,
        tr: tr
    };
};
