/* 
    Class Parser 
*/
module.exports = function ( options ) {
    "use strict";
    
    var context = require( '../context.js' );
    var resolver = require( '../resolver.js' );
    var log = require( '../logHelper.js' );
    var Scope = require( '../scope.js' );
    var NodeAttributes = require( '../nodeAttributes.js' );
    var $ = require( 'jquery' );
    var attributeCache = require( '../cache/attributeCache.js' );
    var i18nHelper = require( '../i18n/i18nHelper.js' );
    
    var I18NDomain = require( '../attributes/I18N/i18nDomain.js' );
    var I18NLanguage = require( '../attributes/I18N/i18nLanguage.js' );
    var METALDefineMacro = require( '../attributes/METAL/metalDefineMacro.js' );
    var METALUseMacro = require( '../attributes/METAL/metalUseMacro.js' );
    var TALAttributes = require( '../attributes/TAL/talAttributes.js' );
    var TALCondition = require( '../attributes/TAL/talCondition.js' );
    var TALContent = require( '../attributes/TAL/talContent.js' );
    var TALDefine = require( '../attributes/TAL/talDefine.js' );
    var TALOmitTag = require( '../attributes/TAL/talOmitTag.js' );
    var TALOnError = require( '../attributes/TAL/talOnError.js' );
    var TALRepeat = require( '../attributes/TAL/talRepeat.js' );
    var TALReplace = require( '../attributes/TAL/talReplace.js' );
    
    var root;
    var dictionary = {};
    var callback;
    var notRemoveGeneratedTags = false;
    var declaredRemotePageUrls = [];
    var i18n;
    
    var scope = undefined;
    var tags = context.getTags();
    
    // Get values from options
    var initFromOptions = function( options ){
        root = options.root || root;
        dictionary = options.dictionary || dictionary;
        callback = options.callback || callback;
        notRemoveGeneratedTags = options.hasOwnProperty( 'notRemoveGeneratedTags' )? options.notRemoveGeneratedTags: notRemoveGeneratedTags;
        declaredRemotePageUrls = options.declaredRemotePageUrls || declaredRemotePageUrls;
        i18n = options.i18n || i18n;
            
        scope = new Scope( dictionary );
    };
    
    initFromOptions( options || {} );
    
    var init = function( initCallback ){
        
        var currentCallback = initCallback || callback;
        
        try {
            if ( ! notRemoveGeneratedTags ){
                removeGeneratedTagsFromAllRootElements( root );
            }
            
            i18nHelper.loadAsyncAuto( 
                dictionary,
                i18n,
                function(){
                    resolver.loadRemotePages( 
                        scope,
                        declaredRemotePageUrls,
                        function (){
                            processCallback( currentCallback );
                        }
                    );
                }
            );
            
        } catch( e ){
            log.fatal( 'Exiting init method of ZPT with errors: ' + e );
            throw e;
        }
    };
    
    var processCallback = function( currentCallback ){
        
        if ( currentCallback && typeof currentCallback == 'function' ) {
            currentCallback();
        }
    };
    
    var run = function( options ){
        
        initFromOptions( options || {} );
        
        try {
            if ( ! notRemoveGeneratedTags ){
                removeGeneratedTagsFromAllRootElements( root );
            }
            
            processAllRootElements( root, scope );
            
        } catch( e ){
            log.fatal( 'Exiting run method of ZPT with errors: ' + e );
            throw e;
        }
    };
        
    var removeGeneratedTagsFromAllRootElements = function( root ) {
        
        // Is multiroot?
        if ( $.isArray( root ) ){ 
            // There are several roots
            for ( var c = 0; c < root.length; c++ ) {
                removeGeneratedTags( root[ c ], scope );
            }
        } else {
            // There is only one root
            removeGeneratedTags( root, scope );
        }
    };
    
    var removeGeneratedTags = function( rootElement ) {
        
        removeTags( rootElement, tags.qdup );       // Remove all generated nodes (repeats)
        removeTags( rootElement, tags.metalMacro ); // Remove all generated nodes (macros)
    };
    
    var removeTags = function( rootElement, tag ){
        
        var node;
        var pos = 0;
        var list = rootElement.querySelectorAll( "*[" + tag + "]" );
        while ( node = list[ pos++ ] ) {
            node.parentNode.removeChild( node );
        }
    };
    
    var processAllRootElements = function( root, scope ) {
        
        // Is multiroot?
        if ( $.isArray( root ) ){ 
            // There are several roots
            for ( var c = 0; c < root.length; c++ ) {
                process( root[ c ], scope );
            }
        } else {
            // There is only one root
            process( root, scope );
        }
    };
    
    var process = function( node, scope ) {

        try {
            // Get the attributes from the node
            var attributes = new NodeAttributes( node );
            
            scope.startElement();

            // Process instructions
            attributes.talRepeat != null ? 
                    processLoop( node, attributes, scope ):
                    processElement( node, attributes, scope );

            scope.endElement();

        } catch ( e ) {
            
            // Try to treat error
            if ( ! treatError( node, scope, e ) ) {
                throw e;
            }
        }
    };
    
    var processLoopNextSibling = function( node ){

        var counter = -1;
        var nextSibling = node;
        do {
            ++counter;
            nextSibling = nextSibling.nextElementSibling;
            if ( ! nextSibling ){
                return {
                    nextSibling: null,
                    counter: counter
                };
            }
        } while ( nextSibling.hasAttribute( tags.qdup ) );

        return {
            nextSibling: nextSibling,
            counter: counter
        };
    };
    
    var processLoop = function( node, attributes, scope ) {
        
        // Process repeat
        var talRepeat = TALRepeat.build( attributes.talRepeat );
        var loop = talRepeat.process( scope, node );

        // Configure the node to clone it later
        node.removeAttribute( tags.talRepeat );
        node.removeAttribute( 'style' );
        node.setAttribute( tags.qdup, 1 );
        var nodeId = node.getAttribute( 'id' );
        node.removeAttribute( 'id' );
        
        var nextSiblingData = processLoopNextSibling( node );
        var nextSibling = nextSiblingData.nextSibling;
        loop.setOffset( nextSiblingData.counter );
        //log.warn( 'loop counter: ' + nextSiblingData.counter );
        
        while ( loop.repeat( scope ) ) {
            
            // Get tmpNode
            var tmpNode = node.cloneNode( true );
            if ( 'form' in tmpNode ) {
                tmpNode.checked = false;
            }

            // Insert it
            var parentNode = node.parentNode;
            parentNode.insertBefore( tmpNode, nextSibling );
            
            // Process it
            if ( ! processElement( tmpNode, attributes, scope ) ) {
                return false;
            }
            
            scope.endElement();
        }

        // Configure repeat node (the original) to enable future reevaluation
        node.style.display = 'none';
        node.setAttribute( tags.talRepeat, attributes.talRepeat );
        if ( nodeId !== '' && nodeId != null ){
            node.setAttribute( 'id', nodeId );
        }
        node.removeAttribute( tags.qdup );
        
        return true;
    };

    var treatError = function( node, scope, exception ) {

        // Exit if there is no on-error expression defined
        var content = scope.get( context.getConf().onErrorVarName );
        if ( content == null ) {
            log.fatal( exception );
            return false;
        }
        
        // Set the error variable
        var templateError = {
            type : typeof exception,
            value : exception
        };
        scope.set( context.getConf().templateErrorVarName, templateError );

        try {
            log.debug( exception );
            
            // Process content
            var talContent = new TALContent( 
                context.getConf().onErrorVarName,
                content );
            
            var result = talContent.process( scope, node );
            scope.endElement();
            return result;
            
        } catch ( e ) {
            log.fatal( e );
            scope.endElement();
            throw e;
        }
    };

    var processElement = function( node, attributes, scope ) {
        
        processOnError( 
            scope, 
            attributes.talOnError );

        if ( ! processDefineMacro(
                node, 
                scope, 
                attributes.metalDefineMacro ) ) {

            // Stop processing the rest of this node as it is invisible
            return false;
        }

        processDefine( scope, attributes.talDefine );
        
        processI18nLanguage( scope, attributes.i18nLanguage );
        
        processI18nDomain( scope, attributes.i18nDomain );
        
        if ( ! processCondition(
                node, 
                scope, 
                attributes.talCondition ) ) {

            // Stop processing the rest of this node as it is invisible
            return false;
        }

        var omittedTag = processOmitTag(
                node, 
                scope, 
                attributes.talOmitTag );

        var replaced = processReplace(
                node, 
                scope, 
                attributes.talReplace );

        if ( ! omittedTag && ! replaced ) {
            
            processAttributes(
                    node, 
                    scope, 
                    attributes.talAttributes );
        }

        if ( ! omittedTag && ! replaced) {

            if ( ! processContent(
                    node, 
                    scope, 
                    attributes.talContent ) ) {

                defaultContent( node, scope );
            }
        }

        processUseMacro(
                node, 
                scope, 
                attributes.metalUseMacro, 
                attributes.talDefine );
        
        return true;
    };

    var defaultContent = function( node, scope ) {

        var childNodes = node.childNodes;
        if ( ! childNodes ) {
            return;
        }

        for ( var i = 0; i < childNodes.length; i++ ) {
            var currentChildNode = childNodes[ i ];

            // Check if node is ELEMENT_NODE and not parsed yet
            if ( currentChildNode && currentChildNode.nodeType == 1
                    && ! currentChildNode.getAttribute( tags.qdup ) ) {
                process( currentChildNode, scope );
            }
        }
    };
    
    var processOnError = function( scope, string ) {
        
        if ( ! string ){
            return false;
        }
        
        var talOnError = attributeCache.getByAttributeClass( TALOnError, string );
        return talOnError.process( scope );
    };

    var processDefine = function( scope, string ) {

        if ( ! string ) {
            return;
        }
        
        var talDefine = attributeCache.getByAttributeClass( TALDefine, string );
        return talDefine.process( scope );
    };
    
    var processI18nDomain = function( scope, string ) {
        
        if ( ! string ) {
            return;
        }
        
        var i18nDomain = attributeCache.getByAttributeClass( I18NDomain, string );
        return i18nDomain.process( scope );
    };
    
    var processI18nLanguage = function( scope, string ) {
        
        if ( ! string ) {
            return;
        }
        
        var i18nLanguage = attributeCache.getByAttributeClass( I18NLanguage, string );
        return i18nLanguage.process( scope );
    };

    var processDefineMacro = function( node, scope, string ) {

        if ( ! string ) {
            return true;
        }

        // No sense to cache macro definitions!
        var metalDefineMacro = METALDefineMacro.build( string );
        return metalDefineMacro.process( scope, node );
    };

    var processUseMacro = function( node, scope, string, stringDefine ) {

        if ( ! string ) {
            return;
        }
        
        // No sense to cache macro uses!
        var metalUseMacro = METALUseMacro.build( string, stringDefine, scope );
        var newNode = metalUseMacro.process( scope, node );
        newNode.setAttribute( tags.qdup, 1 );
        
        // Process new node
        return process( newNode, scope );
    };

    var processCondition = function( node, scope, string ) {

        if ( ! string ) {
            return true;
        }

        var talCondition = attributeCache.getByAttributeClass( TALCondition, string );
        return talCondition.process( scope, node );
    };
    
    var processReplace = function( node, scope, string ) {
        
        if ( ! string ){
            return false;
        }
        
        var talReplace = attributeCache.getByAttributeClass( TALReplace, string );
        return talReplace.process( scope, node );
    };

    var processOmitTag = function( node, scope, string ) {

        if ( string == null ) {
            return false;
        }

        var talOmitTag = attributeCache.getByAttributeClass( TALOmitTag, string );
        return talOmitTag.process( scope, node );
    };
    
    var processContent = function( node, scope, string ) {
        
        if ( ! string ){
            return false;
        }

        var talContent = attributeCache.getByAttributeClass( TALContent, string );
        return talContent.process( scope, node );
    };
  
    var processAttributes = function( node, scope, string ) {

        if ( ! string ) {
            return;
        }

        var talAttributes = attributeCache.getByAttributeClass( TALAttributes, string );
        return talAttributes.process( scope, node );
    };
    
    return {
        run: run,
        init: init
    };
};