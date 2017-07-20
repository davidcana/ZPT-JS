/* 
    Class Resolver 
*/
module.exports = function( ) {
    "use strict";
    
    var $ = require( 'jquery' );
    var context = require( './context.js' );
    
    //var defineMacroTag = context.getTags().metalDefineMacro;
    //var macroTag = context.getTags().metalMacro;
    //var remote = {};
    //var remoteUrls = {};
    var macros = {};
    var remotePages = {};
    
    var getNode = function( macroKey ) {
        
        var node = macros[ macroKey ];
        
        if ( ! node ){
            node = loadNode2( macroKey );
        }
        
        return node? node.cloneNode( true ): undefined;
    };
    
    var isRemote = function( macroKey ){
        return -1 != macroKey.indexOf( context.getConf().macroDelimiter );
    };
    
    var getMacroData = function ( macroKey ){
        var index = macroKey.indexOf( context.getConf().macroDelimiter );
        
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
    /*
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
    };*/
    
    var builDefineMacroSelector = function( macroId ){
        return "[" + context.getTags().metalDefineMacro + "='" + macroId + "']";
    };
    
    var loadNode2 = function( macroKey ){
        
        var macroData = getMacroData( macroKey );
        
        if ( ! macroData.url ){
            // Node is in this page
            var macroId = macroData.macroId;
            var selector = builDefineMacroSelector( macroId );
            var node = $( selector )[0];
            
            return configureNode( 
                    node.cloneNode( true ), 
                    macroId,
                    macroKey );
        }
     
        // Node is in another page
        return loadRemoteNode( macroKey, macroData );
    };
    
    var loadRemoteNode = function( macroKey, macroData ){
        
        var element = remotePages[ macroData.url ];
        
        if ( ! element ){
            throw 'Macros in URL ' + macroData.url + ' not preloaded!';
        }
        
        var selector = builDefineMacroSelector( macroData.macroId );
        var node = $( selector, element )[0];
        
        return configureNode( 
                    node.cloneNode( true ), 
                    macroData.macroId,
                    macroKey );
    };
    /*
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
    };*/
    
    var buildRemotePageUrlList = function(){
        
        var remotePageUrls = [];
        
        $( "[" + context.getTags().metalUseMacro + "]" ).each( function( index ) {
            var currentMacroUse = $( this );
            var macroKey = currentMacroUse.attr( context.getTags().metalUseMacro );
            var macroData = getMacroData( macroKey );
            
            if ( macroData.url && remotePageUrls.indexOf( macroData.url ) == -1 ){
                remotePageUrls.push( macroData.url );
            }
        });
                                                              
        return remotePageUrls;
    };
    
    var loadRemotePages = function( deferred ){

        var remotePageUrls = buildRemotePageUrlList();
        var pending = remotePageUrls.length;
        remotePages = {};
        
        for ( var c = 0; c < remotePageUrls.length; c++ ) {
            var currentPageUrl = remotePageUrls[ c ];
            var element = $( '<div></div>' );
            element.load( currentPageUrl, function( fileContent ) {
                remotePages[ currentPageUrl ] = element;
                if ( --pending == 0 && deferred && $.isFunction( deferred ) ){
                    deferred();
                }
            });
        }
        
        return remotePageUrls.length;
    };
    
    var configureNode = function( node, macroId, macroKey ){
        node.removeAttribute( context.getTags().metalDefineMacro );
        node.setAttribute( context.getTags().metalMacro, macroId );
        
        macros[ macroKey ] = node;
        
        return node;
    };
    
    var getMacroKey = function( macroId, url ){
        return url? macroId + context.getConf().macroDelimiter + url: macroId;
    };
    
    return {
        getNode: getNode,
        isRemote: isRemote,
        //loadRemote: loadRemote,
        loadRemotePages: loadRemotePages
    };
};