/* 
    i18nHelper singleton class 
*/

import { context } from '../context.js';
import { utils } from '../utils.js';
import { I18n } from './i18n.js';

export const i18nHelper = (function() {

    var tr = function ( i18nList, idItems, params, format, subformat, language ){
        
        if ( ! i18nList ) {
            return 'No I18n instance defined!';
        }
        
        if ( ! i18nList.length ){
            return 'Void I18n list!';
        }

        for ( const i18n of i18nList ) {

            // Check if idItems is an array
            if ( Array.isArray( idItems ) ){
                // idItems is an array
                for ( const id of idItems ) {
                    if ( format !== 'string' || i18n.exists( id ) ){
                        return i18n.tr( id, params, format, subformat, language );
                    }
                }
                continue;
            }

            // idItems must be a single id
            const id = idItems;
            if ( format !== 'string' || i18n.exists( id ) ){
                return i18n.tr( id, params, format, subformat, language );
            }
        }
        
        return 'I18n resource "' + idItems + '" not found!';
    };
    
    var loadAsync = function( remoteList, callback, failCallback ){
        
        loadAsyncItem( 
            {}, 
            callback, 
            failCallback,
            remoteList, 
            remoteList.length - 1 );
    };
    
    var loadAsyncItem = function( map, callback, failCallback, remoteList, currentIndex ){
        
        var url = remoteList[ currentIndex ];
        utils.getJSON( 
            {
                url: url,
                done: function( data ) {
                    map[ url ] = data;
                    if ( currentIndex > 0 ){
                        loadAsyncItem( 
                            map, 
                            callback, 
                            failCallback,
                            remoteList, 
                            --currentIndex );
                    } else {
                        callback( map );
                    }
                },
                fail: function( jqxhr, textStatus, error ) {
                    context.asyncError( url, error, failCallback );
                }
            }
        );
    };
    /*
    var loadAsyncItem = function( map, callback, failCallback, remoteList, currentIndex ){
        
        var url = remoteList[ currentIndex ];
        $.getJSON( url )
            .done(
                function( data ) {
                    map[ url ] = data;
                    if ( currentIndex > 0 ){
                        loadAsyncItem( 
                            map, 
                            callback, 
                            failCallback,
                            remoteList, 
                            --currentIndex );
                    } else {
                        callback( map );
                    }
                }
            )
            .fail(
                function( jqxhr, textStatus, error ) {
                    context.asyncError( url, error, failCallback );
                }
            );
    };
    */
    
    var loadAsyncAuto = function( dictionary, i18n, callback, failCallback ){
        
        // Return if it is nothing to do
        if ( ! i18n || ! i18n.files || ! Object.keys( i18n.files ).length ){
            callback();
            return;
        }
        
        // Build jsonFiles array
        var numberOfLanguages = Object.keys( i18n.files ).length;
        var jsonFiles = [];
        var urlPrefix = i18n.urlPrefix || '';
        for ( var lang in i18n.files ){
            var langFiles = i18n.files[ lang ];
            for ( var index in langFiles ){
                var file = langFiles[ index ];
                var url = urlPrefix + file;
                jsonFiles.push( url );
            }
        }
        
        // Use loadAsync method to load all jsonFiles; then register I18n instances and arrays
        loadAsync( 
            jsonFiles, 
            function( i18nMap ){
                
                for ( var lang in i18n.files ){
                    var langFiles = i18n.files[ lang ];
                    var i18nInstanceArray = [];
                    
                    // Register array vars
                    dictionary[ buildI18nInstanceArrayName( lang ) ] = i18nInstanceArray;
                    if ( numberOfLanguages === 1 ){
                        dictionary[ 'i18nArray' ] = i18nInstanceArray;
                    }
                    
                    for ( var index in langFiles ){
                        var file = langFiles[ index ];
                        var url = urlPrefix + file;
                        var i18nInstance = new I18n( lang, i18nMap[ url ] );
                        
                        // Register i18n instances
                        dictionary[ buildI18nInstanceName( file ) ] = i18nInstance;
                        i18nInstanceArray.unshift( i18nInstance ); // Add to the beginning of the array
                    }
                }
                
                callback();
            },
            failCallback 
        );
    };
    
    var buildI18nInstanceArrayName = function( lang ){
        return 'i18n' + lang.toUpperCase() + 'Array';
    };
    
    var buildI18nInstanceName = function( file ){
        
        var fileWithoutExtension = file.substr( 0, file.lastIndexOf( '.' ) );
        return 'i18n' + fileWithoutExtension.toUpperCase();
    };

    return {
        tr: tr,
        loadAsync: loadAsync,
        loadAsyncAuto: loadAsyncAuto
    };
})();
