var zpt = (function() {
    "use strict";
    
    var run = function( root, obj, callbackToApply, notRemoveGeneratedTags ){
        var zptNode =  new ZptNode( root, obj, callbackToApply, notRemoveGeneratedTags );
        zptNode.run();
    };
    
    return {
        run: run
    };
})();

/* Class ZptNode */
var ZptNode = function ( root, obj, callbackToApply, notRemoveGeneratedTags ) {
    "use strict";
    
    var undefined = {}._;

    var DEFINE_DELIMITER = ';';
    var IN_DEFINE_DELIMITER = ' ';
    var ATTRIBUTE_DELIMITER = ';';
    var IN_ATTRIBUTE_DELIMITER = ' ';
    //var IN_REPEAT_DELIMITER = ' ';

    var TEMPLATE_ERROR_VAR_NAME = "error";
    var I18N_EXPRESSION_PREFIX = "i18nExp:";
    var ON_ERROR_VAR_NAME = "on-error";
    
    // TAL attributes for querySelectorAll call
    var beforeAttr = zpt.beforeAttr;
    var beforeText = zpt.beforeText;
    
    // Attributes which don't support setAttribute()
    var altAttr = {
        className : 1,
        "class" : 1,
        innerHTML : 1,
        style : 1,
        src : 1,
        href : 1,
        id : 1,
        value : 1,
        checked : 1,
        selected : 1,
        label : 1,
        htmlFor : 1,
        text : 1,
        title : 1,
        disabled : 1
    };
    var formInputHasBody = {
        BUTTON : 1,
        LABEL : 1,
        LEGEND : 1,
        FIELDSET : 1,
        OPTION : 1
    };
    var callback = callbackToApply;
    var scope = new Scope( obj );
    var querySelectorAll = !!root.querySelectorAll;
    var tags = zptContext.getTags();

    // Optimize comparison check
    var innerText = "innerText" in root ? "innerText" : "textContent";

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
            if ( ! treatError( 
                    node, 
                    scope, 
                    e, 
                    attributes.talOmitTag ) ) {
                throw e;
            }
        }
    };

    var processLoop = function( node, attributes, scope ) {

        // Process repeat
        var loop = loopManager.create( scope, attributes.talRepeat );

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

    var treatError = function(node, scope, exception, exp) {

        // Exit if there is no on-error expression defined
        var onErrorExpression = scope.get( ON_ERROR_VAR_NAME );
        if ( onErrorExpression == null ) {
            return false;
        }

        var content;
        var i18nContent;
        var i18nParams;

        if ( onErrorExpression.startsWith( I18N_EXPRESSION_PREFIX ) ) {
            i18nContent = onErrorExpression.substring( I18N_EXPRESSION_PREFIX.length );
        } else {
            content = onErrorExpression;
        }

        // Set the error variable
        var templateError = {
            type : typeof exception,
            value : exception
        };
        scope.set( TEMPLATE_ERROR_VAR_NAME, templateError );

        try {
            // Process content
            processContent( node, scope, content );

        } catch ( e ) {
            scope.endElement();
            throw e;
        }

        scope.endElement();
        return true;
    };

    var processElement = function( node, attributes, scope ) {

        processOnError( scope, attributes.talOnError );

        if ( ! processDefineMacro(
                node, 
                scope, 
                attributes.metalDefineMacro ) ) {

            // Stop processing the rest of this node as it is invisible
            return false;
        }

        processDefine(scope, attributes.talDefine);

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
                attributes.metalUseMacro, attributes );

        return true;
    };

    var defaultContent = function( node, scope, slotStack ) {

        var childNodes = node.childNodes;
        if ( ! childNodes ) {
            return;
        }

        for ( var i = 0; i < childNodes.length; i++ ) {
            var currentChildNode = childNodes[i];

            // Check if node is ELEMENT_NODE and not parsed yet
            if (currentChildNode && currentChildNode.nodeType == 1
                    && ! currentChildNode.getAttribute( tags.qdup ) ) {
                process( currentChildNode, scope );
            }
        }
    };

    var processAttributes = function( node, scope, exp ) {

        if ( ! exp ) {
            return;
        }

        var expression = exp.trim();
        var tokens = new ExpressionTokenizer( expression, ATTRIBUTE_DELIMITER, true );

        while ( tokens.hasMoreTokens() ) {
            var attribute = tokens.nextToken().trim();
            var space = attribute.indexOf( IN_ATTRIBUTE_DELIMITER );
            if ( space == -1 ) {
                throw 'Bad attributes expression: ' + attribute;
            }
            var name = attribute.substring( 0, space );
            var valueExpression = attribute.substring( space + 1 ).trim();
            /*
             * var value = translate? processI18nContent( evaluationHelper,
             * valueExpression, i18nParams ): Expression.evaluate(
             * valueExpression, evaluationHelper );
             */
            var value = expressionEvaluator.evaluate( scope, valueExpression );

            if ( value != undefined ) {
                if ( beforeAttr ) {
                    beforeAttr( node, name, value );
                }
                if ( altAttr[ name ] ) {
                    switch ( name ) {
                    case "innerHTML":
                        throw node; // should use "qtext"
                    case "disabled":
                    case "checked":
                    case "selected":
                        node[ name ] = !!value;
                        break;
                    case "style":
                        node.style.cssText = value;
                        break;
                    case "text":
                        node[ querySelectorAll ? name : innerText ] = value;
                        break; // option.text unstable in IE
                    case "class":
                        name = "className";
                    default:
                        node[ name ] = value;
                    }
                } else {
                    node.setAttribute( name, value );
                }
            }
        }
    };

    var processOnError = function( scope, exp ) {

        if ( ! exp ) {
            return;
        }

        scope.set( ON_ERROR_VAR_NAME, exp );
    };

    var processDefine = function( scope, exp ) {

        if ( ! exp ) {
            return;
        }

        var expression = exp.trim();
        var tokens = new ExpressionTokenizer( expression, DEFINE_DELIMITER, true );

        while ( tokens.hasMoreTokens() ) {
            var variable = tokens.nextToken().trim();
            var space = variable.indexOf( IN_DEFINE_DELIMITER );
            if ( space == -1 ) {
                throw 'Bad variable definition: ' + variable;
            }

            var token1 = variable.substring( 0, space );
            var token2 = variable.substring( space + 1 ).trim();
            var isGlobal = 'global' === token1;
            var name;
            var valueExpression;

            if ( ! isGlobal ) {
                name = token1;
                valueExpression = token2.trim();
            } else {
                space = token2.indexOf( IN_DEFINE_DELIMITER );
                name = token2.substring( 0, space );
                valueExpression = token2.substring( space + 1 ).trim();
            }

            var value = expressionEvaluator.evaluate( scope, valueExpression);

            scope.set( name, value, isGlobal );
        }
    };

    var processDefineMacro = function( node, scope, exp ) {

        if ( ! exp ) {
            return true;
        }

        // Hide macro definitions
        node.style.display = 'none';

        return false;
    };

    var processUseMacro = function( node, scope, exp, attributes ) {

        if ( ! exp ) {
            return;
        }

        var macroKey = exp.trim();
        var newNode = scope.getResolver().getNode( macroKey ); 
            
        // Copy talDefine attribute from use-macro tag to the macro tag
        if ( attributes.talDefine ) {
            newNode.setAttribute( tags.talDefine, attributes.talDefine );
        }

        // Hide use macro node
        node.style.display = 'none';

        // Remove style attribute to force showing the new node
        newNode.removeAttribute( 'style' );

        // Fill slots
        jQuery( node ).find( "[" + tags.metalFillSlot + "]" )
            .each(
                function( index, value ) {
                    var slotId = $(this).attr( tags.metalFillSlot );
                    // console.log( 'replacing ' + slotId + '...' );

                    var slotContent = $(this)[0].cloneNode( true );
                    var currentNode = jQuery( newNode ).find(
                            "[" + tags.metalDefineSlot + "='" + slotId + "']")[0];
                    currentNode.parentNode.insertBefore( slotContent, currentNode.nextSibling );

                    slotContent.removeAttribute( tags.metalFillSlot );
                    currentNode.remove();
                }
            );
        /*
         * jQuery( newNode ).find( "[data-mdefine-slot]" ).each( function(
         * index, value ){ var slotId = $( this ).attr( 'data-mdefine-slot' );
         * //console.log( 'replacing ' + slotId + '...' );
         * 
         * var slotContent = jQuery( node ).find( "[data-mfill-slot='" + slotId +
         * "']" )[0]; var currentNode = $( this )[0];
         * currentNode.parentNode.insertBefore( slotContent,
         * currentNode.nextSibling );
         * 

         * slotContent.removeAttribute( 'data-mfill-slot' ); $( this ).remove();
         * });
         */

        // Add the macro node
        node.parentNode.insertBefore( newNode, node.nextSibling );

        return;
    };

    var processCondition = function( node, scope, exp ) {

        if ( ! exp ) {
            return true;
        }

        var expression = exp.trim();
        var result = expressionEvaluator.evaluateBoolean( scope, expression );
        node.style.display = result ? '' : 'none';

        return result;
    };

    var processReplace = function( node, scope, exp ) {

        if ( ! exp ) {
            return false;
        }

        var expression = exp.trim();
        var result = expressionEvaluator.evaluate( scope, expression );

        // Remove child nodes
        var parentNode = node.parentNode;
        //parentNode.removeChild( node );

        // Append text node
        var textNode = document.createTextNode( result );
        //parentNode.appendChild( textNode );
        parentNode.replaceChild( textNode, node );
        
        return true;
    };

    var processOmitTag = function( node, scope, exp ) {

        if ( exp == null ) {
            return false;
        }

        var expression = exp.trim();
        var result = expression == '' ? true : expressionEvaluator.evaluateBoolean(scope, expression);

        if ( result ) {
            // Move children from current node to its parent and then remove it
            var parentNode = node.parentNode;
            while ( node.firstChild ) {
                parentNode.appendChild( node.firstChild );
            }
            parentNode.removeChild( node );
        }

        return result;
    };

    var processContent = function( node, scope, exp ) {

        if ( ! exp ) {
            return false;
        }

        var content = exp.trim();
        var HTML_EXPR_STRUCTURE = "html ";

        var html = content.indexOf(HTML_EXPR_STRUCTURE) == 0;
        var valueExpression = html? content.substr( HTML_EXPR_STRUCTURE.length ): content;

        if ( beforeText ) {
            beforeText( node, valueExpression );
        }

        var evaluated = expressionEvaluator.evaluateToNotNull( scope, valueExpression );

        if ( html ) {
            node.innerHTML = evaluated;
        } else {
            node[ "form" in node && !formInputHasBody[node.tagName] ? "value": innerText] = evaluated;
        }

        return true;
    };
    
    return {
        run: run
    };
};

// Support RequireJS module pattern
if ( typeof define == "function" && define.amd ) {
    define( "zpt", function() {
        return zpt;
    });
}
