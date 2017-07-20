/* 
    Class Resolver 
*/
module.exports = function( ) {
    "use strict";
    
    var $ = require( 'jquery' );
    var context = require( './context.js' );
    
    var macros = {};
    var remotePages = {};
    
    var getNode = function( macroKey ) {
        
        var node = macros[ macroKey ];
        
        if ( ! node ){
            node = loadNode( macroKey );
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
    
    var builDefineMacroSelector = function( macroId ){
        return "[" + context.getTags().metalDefineMacro + "='" + macroId + "']";
    };
    
    var loadNode = function( macroKey ){
        
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
        loadRemotePages: loadRemotePages,
        getMacroData: getMacroData,
        getMacroKey: getMacroKey
    };
};