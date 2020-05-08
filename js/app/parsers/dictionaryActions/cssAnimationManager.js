/* 
    Class CSSAnimationManager 
*/
"use strict";

module.exports = (function() {
    
    var animate = function( dictionaryAction, node, callback ) {
    
        // Return if there is no animation
        if ( ! dictionaryAction.animation ){
            return false;
        }
        
        // Set the animationend listener
        if ( callback ){
            node.addEventListener( 'animationend', callback );
        }
        
        // Set the animation
        node.style.animation = dictionaryAction.animation;
        //node.style.animation = "mymove 4s 2";
        
        return true;
    };
    
    var self = {
        animate: animate
    };
    
    return self;
})();
