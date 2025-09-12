/*
    logHelper singleton class
*/

import { context } from './context.js';

export const logHelper = (function() {
    
    var trace = function (){
        
        var logger = context.getLogger();
        
        if ( ! logger ){
            return;
        }
        
        logger.trace.apply( logger, arguments );
    };
    
    var debug = function (){
        
        var logger = context.getLogger();
        
        if ( ! logger ){
            return;
        }
        
        logger.debug.apply( logger, arguments );
    };
    
    var info = function (){
        
        var logger = context.getLogger();
        
        if ( ! logger ){
            return;
        }
        
        logger.info.apply( logger, arguments );
    };
    
    var warn = function (){
        
        var logger = context.getLogger();
        
        if ( ! logger ){
            return;
        }
        
        logger.warn.apply( logger, arguments );
    };
    
    var error = function (){
        
        var logger = context.getLogger();
        
        if ( ! logger ){
            return;
        }
        
        logger.error.apply( logger, arguments );
    };
    
    var fatal = function (){
        
        var logger = context.getLogger();
        
        if ( ! logger ){
            return;
        }
        
        logger.fatal.apply( logger, arguments );
    };
    
    /*
    var fatalAndThrow = function ( message ){
        
        fatal.apply( this, arguments );
        throw message;
    };*/
    
    return {
        trace: trace,
        debug: debug,
        info: info,
        warn: warn,
        error: error,
        fatal: fatal
        //fatalAndThrow: fatalAndThrow
    };
})();
