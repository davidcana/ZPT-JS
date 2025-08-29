/* 
    Class CSSAnimationManager 
*/

export const CSSAnimationManager = (function() {
    
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
                var animationendCallback = function( event ){
                    if ( callback ){
                        callback();
                    }
                };
                //node.removeEventListener( 'animationend', animationendCallback );
                node.addEventListener( 'animationend', animationendCallback );

                // Set the animation
                node.style.animation = dictionaryAction.animation;
            }, 
            10
        );
    };
    
    var reset = function( node ) {
        node.style.animation = 'none';
    };
    
    var self = {
        animate: animate,
        reset: reset
    };
    
    return self;
})();
