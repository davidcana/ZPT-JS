/* 
    i18nHelper singleton class 
*/
"use strict";

var $ = require( 'jquery' );
var I18n = require( './i18n.js' );
var I18nBundle = require( './i18nBundle.js' );
var context = require( '../context.js' );

module.exports = (function() {
    
    var tr = function ( i18nList, id, params, format, subformat, language ){
        
        if ( ! i18nList ) {
            return 'No I18n instance defined!';
        }
            
        var length = i18nList.length;
        if ( ! length ){
            return 'Void I18n list!';
        }

        for ( var i = 0; i < length; i++ ) {
            var i18n = i18nList[ i ];
            if ( format !== 'string' || i18n.exists( id ) ){
                return i18n.tr( id, params, format, subformat, language );
            }
        }
        
        return 'I18n resource "' + id + '" not found!';
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
    /*
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
                    if ( numberOfLanguages == 1 ){
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
