/* 
    Class Resolver 
    External dependencies: None
*/
var ZPT = ZPT || {};

ZPT.Resolver = function( ) {
    "use strict";
    
    //var self = this;
    var defineMacroTag = ZPT.context.getTags().metalDefineMacro;
    var macroTag = ZPT.context.getTags().metalMacro;
    var macros = {};
    var remote = {};
    var remoteUrls = {};
    //var remoteContents = {};
    
    var getNode = function( macroKey ) {
        
        var node = macros[ macroKey ];
        
        if ( ! node ){
            node = loadNode( macroKey );
        }
        
        return node? node.cloneNode( true ): undefined;
    };
    
    var isRemote = function( macroKey ){
        return -1 != macroKey.indexOf( '/' );
    };
    
    var getMacroData = function ( macroKey ){
        var index = macroKey.indexOf( '/' );
        
        return index == -1?
            {
                macroId: macroKey,
                url: null
            }:
            {
                macroId: macroKey.substring( 0, index ),
                url: macroKey.substring( 1 + index )
            };
    };
    
    var loadNode = function( macroKey ){
        var macroData = getMacroData( macroKey );
        var macroId = macroData.macroId;
        var url = macroData.url;
        var selector = "[" + defineMacroTag + "='" + macroId + "']";
        
        if ( ! url ){
            // Node is in this page
            var node = $( selector )[0];
            
            return configureNode( 
                    node.cloneNode( true ), 
                    macroId,
                    macroKey );
            
        }
     
        // Node is in another page
        var data = {
                'url': url,
                'selector': selector,
                'macroId': macroId
        };
        remote[ macroKey ] = data;
        remoteUrls[ url ] = data;
        
        return undefined;
    };
    
    var loadRemote = function( deferred ){
        
        var pending = Object.keys( remoteUrls ).length;
        
        for ( var url in remoteUrls ) {
            var element = $( '<div></div>' );
            
            element.load( url, function( fileContent ) {
                $( "[" + defineMacroTag + "]", element ).each( function( index ) {
                    var currentMacro = $( this );
                    var macroId = currentMacro.attr( defineMacroTag ); 
                    var macroKey = getMacroKey( macroId, url );
                    
                    //console.log( index + ": " + $( this ).text() );
                    //console.log( "macroId: " + macroId );
                    
                    if ( remote[ macroKey ] ){
                        console.log( "Macro with key '" + macroKey + "' loaded." );
                        configureNode(
                                currentMacro[0],
                                macroId,
                                macroKey );
                    } else {
                        console.log( "Macro with key '" + macroKey + "' NOT loaded." );
                    }
                });
                
                if ( --pending == 0 ){
                    deferred();
                }
            });
        }
    };

    /*
    var loadRemote = function( deferred ){
        
        var pending = Object.keys( remoteUrls ).length;
        
        for ( var url in remoteUrls ) {
            var element = $( '<div></div>' );
            element.load( url , function( fileContent ) {
                remoteContents [ url ] = fileContent;
                if ( --pending == 0 ){
                    loadRemoteMacros( deferred );
                }
            });
        }
    }
    var loadRemoteMacros = function( deferred ){
        
        for ( var macroKey in remote ) {
            var data = remote[ macroKey ];
            var url = data.url;
            var selector = data.selector;
            var macroData = getMacroData( macroKey );
            var fileContent = remoteContents [ url ];
            
            var element = $( selector, fileContent );
            
            configureNode(
                    //$( selector, fileContent )[0].cloneNode( true ),
                    $( selector, fileContent )[0],
                    macroData.macroId,
                    macroKey );
        }

        deferred();
    }*/

    var loadRemote2 = function( deferred ){
        
        var remoteList = [];
        
        for ( var macroKey in remote ) {
            remoteList.push( macroKey );
        }
        
        loadRemoteItem( 
                deferred, 
                remoteList,
                remoteList.length - 1);
    };
    
    var loadRemoteItem = function( deferred, remoteList, currentIndex ){
        
        var macroKey = remoteList[ currentIndex ];
        var data = remote[ macroKey ];
        var url = data.url;
        var selector = data.selector;
        var macroData = getMacroData( macroKey );
        
        var element = $( '<div></div>' );
        
        //sample: macros.html  [data-mdefine-macro='macroId']
        element.load( url + ' ' + selector , function( fileContent ) {

            configureNode(
                    element[0].firstChild.cloneNode( true ),
                    macroData.macroId,
                    macroKey );
            
            if ( currentIndex > 0 ){
                loadRemoteItem( 
                        deferred, 
                        remoteList,
                        --currentIndex );
            } else {
                deferred();
            }
        });
    };
    
    var configureNode = function( node, macroId, macroKey ){
        node.removeAttribute( defineMacroTag );
        node.setAttribute( macroTag, macroId );
        
        macros[ macroKey ] = node;
        
        return node;
    };
    
    var getMacroKey = function( macroId, url ){
        return url? macroId + '/' + url: macroId;
    };
    
    return {
        getNode: getNode,
        isRemote: isRemote,
        loadRemote: loadRemote
    };
};

