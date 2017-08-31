/*
    logHelper singleton class
*/
module.exports = (function() {
    "use strict";
    
    var context = require( './context.js' );
    
    //var log4javascript = context.getConf().loggingOn? require( 'log4javascript' ): null;
    //var logger = undefined;
    /*
    var initLogger = function(){
        logger = context.getConf().loggingOn? log4javascript.getDefaultLogger(): undefined;
        
        if ( ! logger ){
            return;
        }
            
        logger.setLevel( log4javascript.Level.DEBUG );
        //logger.removeAllAppenders();
        //logger.addAppender( new log4javascript.BrowserConsoleAppender( true ) );
    }();*/
    
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
