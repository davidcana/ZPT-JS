/*
    logHelper singleton class
*/
module.exports = (function() {
    "use strict";
    
    var context = require( './context.js' );
    var log4javascript = context.getConf().loggingOn? require( 'log4javascript' ): null;
    
    var logger = undefined;
    
    var initLogger = function(){
        
        logger = context.getConf().loggingOn? log4javascript.getDefaultLogger(): undefined;
        
        if ( ! logger ){
            return;
        }
            
        logger.setLevel( log4javascript.Level.DEBUG );
        /*logger.removeAllAppenders();*/
        /*logger.addAppender( new log4javascript.BrowserConsoleAppender( true ) );*/
    }();
    
    var trace = function (){
        
        if ( ! logger ){
            return;
        }
        
        logger.trace.apply( logger, arguments );
    };
    
    var debug = function (){
        
        if ( ! logger ){
            return;
        }
        
        logger.debug.apply( logger, arguments );
    };
    
    var info = function (){
        
        if ( ! logger ){
            return;
        }
        
        logger.info.apply( logger, arguments );
    };
    
    var warn = function (){
        
        if ( ! logger ){
            return;
        }
        
        logger.warn.apply( logger, arguments );
    };
    
    var error = function (){
        
        if ( ! logger ){
            return;
        }
        
        logger.error.apply( logger, arguments );
    };
    
    var fatal = function (){
        
        if ( ! logger ){
            return;
        }
        
        logger.fatal.apply( logger, arguments );
    };
    
    return {
        trace: trace,
        debug: debug,
        info: info,
        warn: warn,
        error: error,
        fatal: fatal
    };
})();
