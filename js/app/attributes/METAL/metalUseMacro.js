/*
    METALUseMacro class
*/
"use strict";

var context = require( '../../context.js' );
var $ = require( 'jquery' );

var METALUseMacro = function( macroKeyToApply, defineToApply ) {
    
    var macroKey = macroKeyToApply;
    var define = defineToApply;
    
    var process = function( scope, node ){
        
        var tags = context.getTags();
        var newNode = scope.getResolver().getNode( macroKey ); 
            
        // Copy talDefine attribute from use-macro tag to the macro tag
        if ( define ) {
            newNode.setAttribute( tags.talDefine, define );
        }
        
        // Hide use macro node
        node.style.display = 'none';

        // Remove style attribute to force showing the new node
        newNode.removeAttribute( 'style' );

        // Fill slots
        $( node ).find( "[" + tags.metalFillSlot + "]" )
            .each(
                function( index, value ) {
                    var slotId = $(this).attr( tags.metalFillSlot );
                    // console.log( 'replacing ' + slotId + '...' );

                    var slotContent = $( this )[0].cloneNode( true );
                    var currentNode = $( newNode ).find(
                            "[" + tags.metalDefineSlot + "='" + slotId + "']")[0];
                    currentNode.parentNode.insertBefore( 
                            slotContent, 
                            currentNode.nextSibling );

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
    };

    return {
        process: process
    };
};

METALUseMacro.id = 'metal:use-macro';

METALUseMacro.build = function( string, stringDefine ) {

    return new METALUseMacro( 
            string.trim(), 
            stringDefine? stringDefine.trim(): undefined );
}

module.exports = METALUseMacro;