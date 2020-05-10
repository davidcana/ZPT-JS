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
        
        // Set the animation
        node.style.animation = 'none';
        setTimeout(
            function() {
                // Set the animationend listener
                node.addEventListener( 'animationend', function(){

                    if ( callback ){
                        callback();
                    }
                });
                
                // Set the animation
                node.style.animation = dictionaryAction.animation;
            }, 
            10
        );
    };
    
    var self = {
        animate: animate
    };
    
    return self;
})();
