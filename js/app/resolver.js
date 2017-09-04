/* 
    Class Resolver 
*/
module.exports = function( ) {
    "use strict";
    
    var $ = require( 'jquery' );
    var context = require( './context.js' );
    var expressionBuilder = require( './expressions/expressionBuilder.js' );
    
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
    /*
    var loadNode = function( macroKey, scope ){

        var mustSetInScope = true;
        var macroData = getMacroData( macroKey, scope );

        if ( ! macroData.url ){
            // No url set

            var urlInScope = scope.get( context.getConf().externalMacroUrlVarName );
            if ( urlInScope ){
                // Node is in another page but using a previously defined url
                macroData.url = urlInScope;
                mustSetInScope = false;

            } else {
                // Node is in this page
                var macroId = macroData.macroId;
                var selector = builDefineMacroSelector( macroId );
                var node = $( selector )[0];

                if ( ! node ){
                    throw "Node using selector '" + selector + "' is null!";
                }

                return configureNode( 
                    node.cloneNode( true ), 
                    macroId,
                    macroKey );
            }
        }

        // Node is in another page
        if ( mustSetInScope ){
            scope.set( context.getConf().externalMacroUrlVarName, macroData.url, true );
        }
        return loadRemoteNode( macroKey, macroData );
    };*/
    
    var loadNode = function( macroKey, scope ){
        
        var mustSetInScope = true;
        var macroData = getMacroData( macroKey, scope );
        
        if ( ! macroData.url ){
            // No url set
            
            var urlInScope = scope.get( context.getConf().externalMacroUrlVarName );
            if ( urlInScope ){
                // Node is in another page but using a previously defined url
                macroData.url = urlInScope;
                mustSetInScope = false;
                
            } else {
                // Node is in this page
                var macroId = macroData.macroId;
                var selector = builDefineMacroSelector( macroId );
                var node = $( selector )[0];

                if ( ! node ){
                    throw "Node using selector '" + selector + "' is null!";
                }
                
                return configureNode( 
                        node.cloneNode( true ), 
                        macroId,
                        macroKey );
            }
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
    
    var buildRemotePageUrlList = function( scope, declaredRemotePageUrls ){
        
        var remotePageUrls = declaredRemotePageUrls.slice();
        
        $( "[" + context.getTags().metalUseMacro + "]" ).each( function( index ) {
            var currentMacroUse = $( this );
            var macroKeyExpressionString = currentMacroUse.attr( context.getTags().metalUseMacro );
            
            try {
                var macroData = getMacroDataUsingExpressionString( macroKeyExpressionString, scope );

                var url = macroData.url;
                if ( url && remotePageUrls.indexOf( url ) == -1 ){
                    remotePageUrls.push( url );
                }
            } catch ( exception ){
                // Macrodata could not be resolved, do nothing
            }
        });
                                                              
        return remotePageUrls;
    };
    
    var loadRemotePages = function( scope, declaredRemotePageUrls, deferred ){

        var remotePageUrls = buildRemotePageUrlList( scope, declaredRemotePageUrls );
        var pending = remotePageUrls.length;
        remotePages = {};
        
        for ( var c = 0; c < remotePageUrls.length; c++ ) {
            var currentPageUrl = remotePageUrls[ c ];
            
            $.ajax({
                url: currentPageUrl,
                dataType: 'html'
            }).done( function( html ) {
                var element = $( '<div></div>' );
                element.html( html );
                remotePages[ this.url ] = element;
                if ( --pending == 0 && deferred && $.isFunction( deferred ) ){
                    deferred();
                }
            });
            /*
            var element = $( '<div></div>' );
            element.load( currentPageUrl, function( response, status, xhr ) {
                remotePages[ currentPageUrl ] = element;
                var $this = $( this );
                if ( --pending == 0 && deferred && $.isFunction( deferred ) ){
                    deferred();
                }
            });*/
            /*
            var element = $( '<div></div>' );
            element.load( 
                currentPageUrl, 
                makeLoadRemotePageFunction( remotePages, currentPageUrl, pending, deferred ));
                */
        }
        
        return remotePageUrls.length;
    };
    /*
    var makeLoadRemotePageFunction = function( remotePages, currentPageUrl, pending, deferred){
        return function() {
            remotePages[ currentPageUrl ] = this;
            if ( --pending == 0 && deferred && $.isFunction( deferred ) ){
                deferred();
            }
        }
    };*/
    
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
    
    return {
        getNode: getNode,
        //isRemote: isRemote,
        loadRemotePages: loadRemotePages,
        getMacroData: getMacroData,
        getMacroKey: getMacroKey
    };
};