/* 
    Class CSSAnimationManager 
*/
"use strict";

module.exports = (function() {
    
    var animate = function( dictionaryAction, node, callback ) {
    
        // Run callback and return if there is no animation
        if ( ! dictionaryAction.animation ){
            if ( callback ){
                callback();
            };
            return;
        }
        
        // Set the animationend listener
        if ( callback ){
            node.addEventListener( 'animationend', callback );
        }
        
        // Set the animation
        node.style.animation = dictionaryAction.animation;
        
        return true;
    };
    
    var self = {
        animate: animate
    };
    
    return self;
})();
