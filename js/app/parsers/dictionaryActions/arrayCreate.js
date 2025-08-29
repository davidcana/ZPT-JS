/* 
    Class ArrayCreate
*/
//var AbstractArrayAction = require( './abstractArrayAction.js' );
//var context = require( '../../context.js' );
//var ParserNodeRenderer = require( '../../parsers/parserNodeRenderer.js' );
//var utils = require( '../../utils.js' );
import { context } from '../../context.js';
import { utils } from '../../utils.js';
import { AbstractArrayAction } from './abstractArrayAction.js';
import { ParserNodeRenderer } from '../../parsers/parserNodeRenderer.js';

export const ArrayCreate = function( object, dictionary ) {
    AbstractArrayAction.call( this, object, dictionary );
    
    this.newElement = object.newElement;
};

ArrayCreate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayCreate.prototype.updateDictionary = function( dictionary ){
    
    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getValue( dictionary );
    
    if ( this.indexToUse === -1 ){
        this.resolvedIndex = arrayValue.length;
        arrayValue.push( this.newElement );
    } else {
        this.resolvedIndex = this.indexToUse;
        arrayValue.splice( this.indexToUse, 0, this.newElement );
    }
};

ArrayCreate.prototype.updateHTML = function( indexItem, parserUpdater, actionInstance ){
    
    // Must get the nodeToUpdate
    var node = this.resolveThisNode( indexItem, parserUpdater );
    if ( ! node ){
        throw 'No node found to clone';
    }
    
    // Init some vars
    var tags = context.getTags();
    var parentNode = node.parentNode;
    
    // Clone and configure the node
    var tmpNode = ParserNodeRenderer.cloneAndConfigureNode( 
        node, 
        true, 
        tags, 
        node.getAttribute( tags.id ) 
    );
    ParserNodeRenderer.configureNodeForNewItem( 
        tmpNode, 
        tags, 
        parentNode, 
        indexItem, 
        this.resolvedIndex
    );
    
    // Insert it
    var sibling = this.indexToUse === -1?
        null:
        parentNode.children[ 1 + this.indexToUse ];
    parentNode.insertBefore( tmpNode, sibling );
    
    // Update the selected node
    parserUpdater.updateNode( tmpNode );
    
    // Run animation
    parserUpdater.runAnimation( actionInstance, tmpNode );
    
    return true;
};

ArrayCreate.buildMultiple = function( object, dictionary ){

    var actions = [];
    
    // Copy newElements to a new array
    var newElements = utils.copyArray( object.newElement );
    
    // Configure the object, create the first instance and add it to the list
    object.newElement = newElements[ 0 ];
    var firstActionInstance = new ArrayCreate( object, dictionary );
    actions.push( firstActionInstance );
    
    // Get the firstIndex and if the new elments must be the last
    var firstIndex = firstActionInstance.getIndexNumericValue();
    var isLast = -1 === firstIndex;
        
    // Build actions list
    for ( var i = 1; i < newElements.length; ++i ){
        var newElement = newElements[ i ];
        
        // Clone the object and configure the newElement and the index
        var newObject = utils.deepExtend( object );
        newObject.newElement = newElement;
        newObject.index = isLast?
            -1:
            firstIndex + i;
        
        // Instance the action instance and add it to the list
        var newActionInstance = new ArrayCreate( newObject, dictionary );
        actions.push( newActionInstance );
    }
    
    return actions;
};

//module.exports = ArrayCreate;
