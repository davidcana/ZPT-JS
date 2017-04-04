/* 
    Class Parser 
*/
module.exports = function ( options ) {
    "use strict";
    
    var context = require( '../context.js' );
    var Scope = require( '../scope.js' );
    var NodeAttributes = require( '../nodeAttributes.js' );
    var $ = require( 'jquery' );
    var attributeCache = require( '../cache/attributeCache.js' );
    
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
    
    // Get values from options
    var root = options.root;
    var dictionary = options.dictionary;
    var callback = options.callback;
    var notRemoveGeneratedTags = options.notRemoveGeneratedTags;
    
    // Continue with other var inits
    var scope = new Scope( dictionary );
    var querySelectorAll = !!root.querySelectorAll;
    var tags = context.getTags();

    // Optimize comparison check
    var innerText = "innerText" in root? "innerText": "textContent";

    var run = function(){
        if ( ! notRemoveGeneratedTags ){
            removeGeneratedTags();
        }

        if ( ! preloadMacros() ){
            processRoot( root, scope );
        }
    };
    
    var removeTags = function( tag ){
        var node;
        var pos = 0;
        var list = root.querySelectorAll( "*[" + tag + "]" );
        while ( ( node = list[ pos++ ] ) ) {
            node.parentNode.removeChild( node );
        }
    };
    
    var removeGeneratedTags = function() {
        
        if ( querySelectorAll ) {
            removeTags( tags.qdup );       // Remove all generated nodes (repeats)
            removeTags( tags.metalMacro ); // Remove all generated nodes (macros)
        }
    };
    
    var preloadMacros = function() {
        
        var numberOfRemoteMacros = 0;
        var resolver = scope.getResolver();
        
        $( "[" + tags.metalUseMacro + "]" ).each(
            function( index, value ) {
                var macroKey = $(this).attr( tags.metalUseMacro );
                
                //console.log( 'use macro  ' + macroKey + '...' );
                var newNode = resolver.getNode( macroKey ); 
                if ( ! newNode && resolver.isRemote( macroKey ) ){
                    ++numberOfRemoteMacros;
                }
            }
        );
        
        //console.log( numberOfRemoteMacros + ' delayed macros found.' );
        
        if ( numberOfRemoteMacros > 0 ){
            resolver.loadRemote(
                    function (){
                        processRoot( root, scope );
                    });
        }
        
        return numberOfRemoteMacros;
    };
    
    var processRoot = function( node, scope ) {
        process( node, scope );
        
        if ( callback && typeof callback == 'function' ) {
            callback();
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
            if ( ! treatError( node, scope, e ) ) {
                throw e;
            }
        }
    };

    var processLoop = function( node, attributes, scope ) {

        // Process repeat
        var talRepeat = TALRepeat.build( attributes.talRepeat );
        var loop = talRepeat.process( scope, node );

        node.removeAttribute( tags.talRepeat );
        node.removeAttribute( 'style' );
        node.setAttribute( tags.qdup, 1 );

        while ( loop.repeat( scope ) ) {
            // Get tmpNode
            var tmpNode = node.cloneNode( true );
            if ( 'form' in tmpNode ) {
                tmpNode.checked = false;
            }

            // Insert it
            var parentNode = node.parentNode;
            parentNode.insertBefore( tmpNode, null );
            //var nextSibling = node.nextSibling;
            //parentNode.insertBefore( tmpNode, nextSibling );
            
            // Process it
            if ( ! processElement( tmpNode, attributes, scope ) ) {
                return false;
            }
        }

        // Configure repeat node (the original) to enable future reevaluation
        //$( node ).hide();
        //$( node ).css( "display", "none" );
        //node.style = $( 'body' )[0].style;
        /*
        var style =  $( 'body' )[0].style;
        if ( node.style ){
            node.style.display = 'none';
        } else {
            node.style = { display : 'none' };
        }*/
        //node.setAttribute( 'style', 'display: none;' );
        node.style.display = 'none';
        node.setAttribute( tags.talRepeat, attributes.talRepeat );
        node.removeAttribute( tags.qdup );

        return true;
    };

    var treatError = function( node, scope, exception ) {

        // Exit if there is no on-error expression defined
        var content = scope.get( context.getConf().onErrorVarName );
        if ( content == null ) {
            return false;
        }

        // Set the error variable
        var templateError = {
            type : typeof exception,
            value : exception
        };
        scope.set( context.getConf().templateErrorVarName, templateError );

        try {
            // Process content
            var talContent = new TALContent( content );
            return talContent.process( scope, node );
            
        } catch ( e ) {
            scope.endElement();
            throw e;
        }

        scope.endElement();
        return true;
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

    var defaultContent = function( node, scope, slotStack ) {

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
        var metalUseMacro = METALUseMacro.build( string, stringDefine );
        return metalUseMacro.process( scope, node );
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
        run: run
    };
};