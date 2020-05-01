/* 
    resolver singleton class
*/
var utils = require( './utils.js' );
var context = require( './context.js' );
var expressionBuilder = require( './expressions/expressionBuilder.js' );

module.exports = (function( ) {
    "use strict";
    
    var macros = {};
    var remotePages = {};
    
    var getNode = function( macroKey, scope ) {
        
        var node = macros[ macroKey ];
        
        if ( ! node ){
            node = loadNode( macroKey, scope );
        }
        
        return node? node.cloneNode( true ): undefined;
    };
    /*
    var isRemote = function( macroKey ){
        return -1 != macroKey.indexOf( context.getConf().macroDelimiter );
    };*/
    
    var getMacroDataUsingExpression = function ( macroKeyExpression, scope ){
        
        var macroKey = macroKeyExpression.evaluate( scope );
        
        if ( ! macroKey ){
            return {
                macroId: null,
                url: null
            };
        }
        
        return getMacroData( macroKey, scope );
    };
    
    var getMacroDataUsingExpressionString = function ( macroKeyExpressionString, scope ){
        
        var macroKeyExpression = expressionBuilder.build( macroKeyExpressionString );
        return getMacroDataUsingExpression( macroKeyExpression, scope );
    };
    
    var getMacroData = function ( macroKey, scope ){

        var index = macroKey.indexOf( context.getConf().macroDelimiter );
        
        return index === -1?
            {
                macroId: macroKey,
                url: null
            }:
            {
                macroId: macroKey.substring( 0, index ),
                url: buildURL ( macroKey.substring( 1 + index ) )
            };
    };
    
    var builDefineMacroSelector = function( macroId ){
        return "[" + filterSelector( context.getTags().metalDefineMacro ) + "='" + macroId + "']";
    };
    
    var loadNode = function( macroKey, scope ){

        var macroData = getMacroData( macroKey, scope );

        if ( macroData.url ){
            // Node is in another page
            return loadRemoteNode( macroKey, macroData );
        }
        
        // No url set
        var urlInScope = scope.get( context.getConf().externalMacroUrlVarName );
        if ( urlInScope ){
            // Try to find node in another page but using a previously defined url
            macroData.url = urlInScope;
            var remoteNode = loadRemoteNode( macroKey, macroData );
            if ( remoteNode ){
                // Node is found in another page
                return remoteNode;
            }
        }
        
        // Node is in this page
        var macroId = macroData.macroId;
        var selector = builDefineMacroSelector( macroId );
        var node = window.document.querySelector( selector );

        if ( ! node ){
            throw "Node using selector '" + selector + "' is null!";
        }

        return configureNode( 
            node.cloneNode( true ), 
            macroId,
            macroKey );
        
    };
    var loadRemoteNode = function( macroKey, macroData ){
        
        var element = remotePages[ macroData.url ];
        
        if ( ! element ){
            throw 'Macros in URL ' + macroData.url + ' not preloaded!';
        }
        
        var selector = builDefineMacroSelector( macroData.macroId );
        var node = element.querySelector( selector );
        
        if ( ! node ){
            return undefined;
        }
        
        return configureNode( 
                    node.cloneNode( true ), 
                    macroData.macroId,
                    macroKey );
    };
    
    var buildRemotePageUrlList = function( scope, declaredRemotePageUrls ){
        
        var remotePageUrls = declaredRemotePageUrls.slice();
        
        var list = document.querySelectorAll( 
            "[" + filterSelector( context.getTags().metalUseMacro ) + "]"
        );
        var currentMacroUse;
        var pos = 0;
        while ( currentMacroUse = list[ pos++ ] ) {
            var macroKeyExpressionString = currentMacroUse.getAttribute( context.getTags().metalUseMacro );
            
            try {
                var macroData = getMacroDataUsingExpressionString( macroKeyExpressionString, scope );

                var url = macroData.url;
                if ( url && remotePageUrls.indexOf( url ) === -1 ){
                    remotePageUrls.push( url );
                }
            } catch ( exception ){
                // Macrodata could not be resolved, do nothing
            }
        }
                                                              
        return remotePageUrls;
    };
    
    // Add preffix if the URL is not absolute
    var buildURL = function( URL ){
        return URL.startsWith( '/' )? URL: context.getConf().externalMacroPrefixURL + URL;
    };
    
    var loadRemotePages = function( scope, declaredRemotePageUrls, callback, failCallback ){

        var remotePageUrls = buildRemotePageUrlList( scope, declaredRemotePageUrls );
        var pending = remotePageUrls.length;
        remotePages = {};
        
        if ( ! pending ){
            if ( callback && utils.isFunction( callback ) ){
                callback();   
            }
            return;
        }
        
        for ( var c = 0; c < remotePageUrls.length; c++ ) {
            var currentPageUrl = buildURL( remotePageUrls[ c ] );
            
            /* jshint loopfunc: true */
            utils.ajax(
                {
                    url: currentPageUrl,
                    //dataType: 'html',
                    done: function( html ) {
                        var element = document.createElement( 'div' );
                        element.innerHTML = html;
                        remotePages[ this.url ] = element;
                        if ( --pending == 0 && callback && utils.isFunction( callback ) ){
                            callback();
                        }
                    },
                    fail: function( jqXHR, textStatus, error ) {
                        context.asyncError( currentPageUrl, error, failCallback );
                    }
                }
            );
            /*
            $.ajax({
                url: currentPageUrl,
                dataType: 'html'
            }).done( function( html ) {
                var element = $( '<div></div>' );
                element.html( html );
                remotePages[ this.url ] = element;
                if ( --pending == 0 && callback && utils.isFunction( callback ) ){
                    callback();
                }
            }).fail( function( jqXHR, textStatus, error ) {
                context.asyncError( currentPageUrl, error, failCallback );
            });
            */
        }
    };
                  
    var configureNode = function( node, macroId, macroKey ){
        node.removeAttribute( context.getTags().metalDefineMacro );
        node.setAttribute( context.getTags().metalMacro, macroId );
        
        macros[ macroKey ] = node;
        
        return node;
    };
    
    var getMacroKey = function( macroKeyExpression, scope ){
        
        var macroData = getMacroDataUsingExpression( macroKeyExpression, scope );
        
        return macroData.url? macroData.macroId + context.getConf().macroDelimiter + macroData.url: macroData.macroId;
    };
    
    // Must filter to replace : by \\:
    var filterSelector = function( selector ){
        return selector.replace( /:/gi, '\\:' );
    };
    
    return {
        getNode: getNode,
        //isRemote: isRemote,
        loadRemotePages: loadRemotePages,
        getMacroData: getMacroData,
        getMacroKey: getMacroKey,
        filterSelector: filterSelector
    };
})();
