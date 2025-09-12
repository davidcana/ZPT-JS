/* 
    Class AbstractArrayAction
*/

import { context } from '../../context.js';
import { utils } from '../../utils.js';
import { AbstractAction } from './abstractAction.js';

export const AbstractArrayAction = function( object, dictionary ) {
    AbstractAction.call( this, object, dictionary );
    
    this.index = object.index;
};

AbstractArrayAction.prototype = Object.create( AbstractAction.prototype );

AbstractArrayAction.getIndexNumericValue = function( index ){
    
    if ( index === undefined ){
        return undefined;   
    }
    
    if ( index === context.getConf().firstIndexIdentifier ){
        return 0;
    } else if ( index === context.getConf().lastIndexIdentifier ){
        return -1; // This means it is the last
    }
    return index;
};

AbstractArrayAction.prototype.getIndexNumericValue = function(){
    return AbstractArrayAction.getIndexNumericValue( this.index );
};

AbstractArrayAction.prototype.getIndexToUse = function( dictionary ){

    if ( this.index === undefined && this.currentElement === undefined ){
        throw 'index or currentElement must be defined in ' + this.id + ' array action!';
    }
    
    // Check if it uses the index
    var indexNumericValue = this.getIndexNumericValue();
    if ( indexNumericValue !== undefined ){
        return indexNumericValue;
    }

    // Must use currentElement
    var arrayValue = this.getValue( dictionary );
    
    for ( var i = 0; i < arrayValue.length; ++i ){
        var element = arrayValue[ i ];
        if ( AbstractAction.elementMaches( element, this.currentElement ) ){
            return i;
        }
    }
    
    throw 'currentElement ' + utils.genericToString( this.currentElement ) + ' not found in ' + this.id + ' array action!';
};

AbstractArrayAction.prototype.attributeInstanceIsRelated = function( attributeInstance ){
    return AbstractArrayAction.staticAttributeInstanceIsRelated( attributeInstance );
};

AbstractArrayAction.staticAttributeInstanceIsRelated = function( attributeInstance ){
    return attributeInstance.type === 'tal:repeat';
};

AbstractArrayAction.prototype.updateDictionary = function(){
    throw 'Error: updateDictionary must be implemented!';
};

AbstractArrayAction.prototype.updateHTML = function(){
    throw 'Error: updateHTML must be implemented!';
};

AbstractArrayAction.prototype.resolveChildNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return this.indexToUse === -1?
        null:
        this.getIndexOfLoop( node.parentNode, indexItem.nodeId, this.indexToUse );
};

AbstractArrayAction.prototype.getIndexOfLoop = function( parentNode, nodeId, indexInLoop ){
    
    var numberOfChildren = parentNode.childElementCount;
    for ( var i = 0; i < numberOfChildren; ++i ){
        var childNode = parentNode.children[ i ];
        var currentNodeId = childNode.getAttribute( context.getTags().id );
        if ( currentNodeId === nodeId ){
            return parentNode.children[ 1 + i + indexInLoop ];
        }
    }
    
    return null;
};

