/* 
    Class AbstractAction
*/

import { context } from '../../context.js';
import { utils } from '../../utils.js';

export const AbstractAction = function( object, dictionary ) {
    
    this.id = object.id;
    this.var = object.var;
    this.currentElement = object.currentElement;
    this.animation = object.animation;
    this.animationCallback = object.animationCallback;
    if ( object.search ){
        if ( this.id || this.var ){
            throw 'Error in action: you can not set a search and then and id: if you set a search ZPT-JS will set the id for you!';
        }
        this.initializeUsingSearch( object.search, dictionary );
    }
};

AbstractAction.prototype.initializeUsingSearch = function( search, dictionary ){

    this.id = '';
    this.var = dictionary;
    
    // Iterate search items and build id and var
    for ( var i = 0; i < search.length; ++i ){
        var item = search[ i ];
        
        // Replace item is it a search object, '_first_' or '_last_'
        if ( utils.isPlainObject( item ) ){
            item = this.search( this.var, item );
        } else if ( item === context.getConf().firstIndexIdentifier ){
            item = 0;
        } else if ( item === context.getConf().lastIndexIdentifier ){
            item = this.var.length - 1;
        }
        
        // Build the id
        if ( Number.isInteger( item ) ){
            this.id += '[' + item + ']';
        } else {
            var separator = i === 0? '': '.';
            this.id += separator + item;
        }
        
        // Build the var
        this.var = this.var[ item ];
    }
};

AbstractAction.prototype.search = function( list, expressionElement ){
    
    for ( var i = 0; i < list.length; ++i ){
        var record = list[ i ];
        if ( AbstractAction.elementMaches( record, expressionElement ) ){
            return i;
        }
    }
    
    throw 'No record found matching your criteria!';
};

AbstractAction.elementMaches = function( element, expressionElement ){
    
    if ( expressionElement == undefined ){
        throw 'Expression to match must not be null!';
    }

    if ( Array.isArray( expressionElement ) ){
        throw 'Expression ' + utils.genericToString( expressionElement ) + ' to match must not be an array!';
    }

    if ( utils.isPlainObject( expressionElement ) ){
        for ( var i in expressionElement ){
            if ( expressionElement[ i ] !== element[ i ] ){
                return false;
            }
        }
        return true;
    }

    // Must be numeric or string
    return element === expressionElement;
};

AbstractAction.prototype.getValue = function( dictionary ){
    return this.var === undefined?
        dictionary[ this.id ]:
        this.var;
};

AbstractAction.prototype.resolveThisNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return node;
};

AbstractAction.prototype.attributeInstanceIsRelated = function( attributeInstance ){
    throw 'Error: attributeInstanceIsRelated must be implemented!';
};

AbstractAction.prototype.updateDictionary = function(){
    throw 'Error: updateDictionary must be implemented!';
};

AbstractAction.prototype.updateHTML = function(){
    throw 'Error: updateHTML must be implemented!';
};

