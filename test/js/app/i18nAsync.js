"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunitjs' );
var zpt = require( '../../../js/app/main.js' );
var I18n = require( '../../../js/app/i18n/i18n.js' );
var I18nBundle = require( '../../../js/app/i18n/i18nBundle.js' );
var i18nHelper = require( '../../../js/app/i18n/i18nHelper.js' );

var es1JSONFileName = 'i18n/es1.json';
var en1JSONFileName = 'i18n/en1.json';
var es2JSONFileName = 'i18n/es2.json';
var en2JSONFileName = 'i18n/en2.json';

var jsonFiles = [ es1JSONFileName , en1JSONFileName, es2JSONFileName , en2JSONFileName ];

i18nHelper.loadAsync( jsonFiles , callback );

function callback( i18nMap ){
    
    // Create I18n and I18nBundle instances
    var i18nES =  new I18n( 'es', i18nMap[ es1JSONFileName ] );
    var i18nES2 = new I18n( 'es', i18nMap[ es2JSONFileName ] );
    var i18nEN = new I18n( 'en', i18nMap[ en1JSONFileName ] );
    var i18nEN2 = new I18n( 'en', i18nMap[ en2JSONFileName ] );
    var i18nBundle = new I18nBundle( i18nES, i18nEN );
    var i18nBundle2 = new I18nBundle( i18nES2, i18nEN2 );
    
    // Init dictionary
    var dictionary = {
        'i18n-ES':  i18nES,
        'i18n-ES2': i18nES2,
        'i18n-EN':  i18nEN,
        'i18n-EN2': i18nEN2,
        'i18nBundle': i18nBundle,
        'i18nBundle2': i18nBundle2,
        'i18nESArray': [ i18nES2, i18nES ],
        'i18nENArray': [ i18nEN2, i18nEN ],
        fireError: function( ){
            //return 1 / 0;
            document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
        },
        date : new Date( Date.UTC( 2012, 11, 20, 3, 0, 0 ) )
    };

    zpt.run({
        root: document.body,
        dictionary: dictionary
    });

    QUnit.test( "Simple i18n test", function( assert ) {
        assert.equal( $('#t1-1').html() , "¡Hola mundo!" );
        assert.equal( $('#t1-2').html() , "Hello world!" );
    });

    QUnit.test( "With parameters (spanish)", function( assert ) {
        assert.equal( $('#t2-1').html() , "Él no ha encontrado ningún resultado" );
        assert.equal( $('#t2-2').html() , "Él ha encontrado un único resultado" );
        assert.equal( $('#t2-3').html() , "Él ha encontrado 10 resultados" );
        assert.equal( $('#t2-4').html() , "Ella no ha encontrado ningún resultado" );
        assert.equal( $('#t2-5').html() , "Ella ha encontrado un único resultado" );
        assert.equal( $('#t2-6').html() , "Ella ha encontrado 10 resultados" );
        assert.equal( $('#t2-7').html() , "Ellos no han encontrado ningún resultado" );
        assert.equal( $('#t2-8').html() , "Ellos han encontrado un único resultado" );
        assert.equal( $('#t2-9').html() , "Ellos han encontrado 10 resultados" );
    });

    QUnit.test( "With parameters (english)", function( assert ) {
        assert.equal( $('#t3-1').html() , "He found no results" );
        assert.equal( $('#t3-2').html() , "He found 1 result" );
        assert.equal( $('#t3-3').html() , "He found 10 results" );
        assert.equal( $('#t3-4').html() , "She found no results" );
        assert.equal( $('#t3-5').html() , "She found 1 result" );
        assert.equal( $('#t3-6').html() , "She found 10 results" );
        assert.equal( $('#t3-7').html() , "They found no results" );
        assert.equal( $('#t3-8').html() , "They found 1 result" );
        assert.equal( $('#t3-9').html() , "They found 10 results" );
    });

    QUnit.test( "2 domains in domain definition: i18n-ES2 i18n-ES (spanish)", function( assert ) {
        assert.equal( $('#t4-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t4-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "2 domains in domain definition: i18n-EN2 i18n-EN (english) ", function( assert ) {
        assert.equal( $('#t5-1').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t5-2').html() , "He found no results" );
    });

    QUnit.test( "Nested domains: i18n-ES and i18n-ES2 nested (spanish) ", function( assert ) {
        assert.equal( $('#t6-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t6-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "Nested domains: i18n-EN and i18n-EN2 nested (english) ", function( assert ) {
        assert.equal( $('#t7-1').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t7-2').html() , "He found no results" );
    });

    QUnit.test( "Attributes test (spanish)", function( assert ) {
        assert.equal( $('#t8-1').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-2').attr('title') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-3').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-3').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-4').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-4').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-4').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Attributes test (english)", function( assert ) {
        assert.equal( $('#t9-1').attr('title') , "Hello world!" );
        assert.equal( $('#t9-2').attr('title') , "She found 4 results" );
        assert.equal( $('#t9-3').attr('title') , "Hello world!" );
        assert.equal( $('#t9-3').attr('alt') , "She found 4 results" );
        assert.equal( $('#t9-4').attr('title') , "Hello world!" );
        assert.equal( $('#t9-4').attr('alt') , "She found 4 results" );
        assert.equal( $('#t9-4').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Replace (spanish) ", function( assert ) {
        assert.equal( $('#t10-1').html().trim() , "¡Hola mundo!" );
        assert.equal( $('#t10-2').html().trim() , "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Replace (english) ", function( assert ) {
        assert.equal( $('#t11-1').html().trim() , "Hello world!" );
        assert.equal( $('#t11-2').html().trim() , "He found 1 result" );
    });

    QUnit.test( "Define (spanish) ", function( assert ) {
        assert.equal( $('#t12-1').html(), "¡Hola mundo!" );
        assert.equal( $('#t12-2').html(), "Él ha encontrado un único resultado" );
        assert.equal( $('#t12-3').html(), "¡Hola mundo!" );
        assert.equal( $('#t12-4').html(), "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Define (english) ", function( assert ) {
        assert.equal( $('#t13-1').html(), "Hello world!" );
        assert.equal( $('#t13-2').html(), "He found 1 result" );
        assert.equal( $('#t13-3').html(), "Hello world!" );
        assert.equal( $('#t13-4').html(), "He found 1 result" );
    });

    QUnit.test( "On error test (spanish)", function( assert ) {
        assert.equal( $('#t14-1').html() , "¡Hola mundo!" );
        assert.equal( $('#t14-2').html() , "Error encontrado... Oh, noooo!" );
    });

    QUnit.test( "On error test (english)", function( assert ) {
        assert.equal( $('#t15-1').html() , "Hello world!" );
        assert.equal( $('#t15-2').html() , "Error found... Oh, noooo!" );
    });

    QUnit.test( "Numbers (spanish)", function( assert ) {
        assert.equal( $('#t16-1').html() , "1.355,23" );
        assert.equal( $('#t16-2').html() , "1.355,236" );
        assert.equal( $('#t16-3').html() , "001.355,236" );
    });

    QUnit.test( "Numbers (english)", function( assert ) {
        assert.equal( $('#t17-1').html() , "1,355.23" );
        assert.equal( $('#t17-2').html() , "1,355.236" );
        assert.equal( $('#t17-3').html() , "001,355.236" );
    });

    QUnit.test( "Currencies (spanish)", function( assert ) {
        assert.equal( $('#t18-1').html() , "1.355,23&nbsp;€" );
        assert.equal( $('#t18-2').html() , "1.355,23&nbsp;$" );
        assert.equal( $('#t18-3').html() , "1.355,23 euros" );
        assert.equal( $('#t18-4').html() , "1.355,23 dólares estadounidenses" );
    });

    QUnit.test( "Currencies (english)", function( assert ) {
        assert.equal( $('#t19-1').html() , "€1,355.23" );
        assert.equal( $('#t19-2').html() , "$1,355.23" );
        assert.equal( $('#t19-3').html() , "1,355.23 euros" );
        assert.equal( $('#t19-4').html() , "1,355.23 US dollars" );
    });

    QUnit.test( "Datetime (spanish)", function( assert ) {
        assert.equal( $('#t20-1').html() , "20/12/2012" );
        assert.equal( $('#t20-2').html() , "21/12/2012" );
        assert.equal( $('#t20-3').html() , "jueves, 20 de diciembre de 2012" );
        assert.equal( $('#t20-4').html() , "viernes, 21 de diciembre de 2012" );
        assert.equal( $('#t20-5').html() , "4:00:00" );
        assert.equal( $('#t20-6').html() , "4:00:00" );
        assert.equal( $('#t20-7').html() , "jueves, 20 de diciembre de 2012 4:00:00" );
        assert.equal( $('#t20-8').html() , "viernes, 21 de diciembre de 2012 4:00:00" );
    });

    QUnit.test( "Datetime (english)", function( assert ) {
        assert.equal( $('#t21-1').html() , "12/20/2012" );
        assert.equal( $('#t21-2').html() , "12/21/2012" );
        assert.equal( $('#t21-3').html() , "Thursday, December 20, 2012" );
        assert.equal( $('#t21-4').html() , "Friday, December 21, 2012" );
        assert.equal( $('#t21-5').html() , "4:00:00 AM" );
        assert.equal( $('#t21-6').html() , "4:00:00 AM" );
        assert.equal( $('#t21-7').html() , "Thursday, December 20, 2012, 4:00:00 AM" );
        assert.equal( $('#t21-8').html() , "Friday, December 21, 2012, 4:00:00 AM" );
    });
    
    QUnit.test( "Simple i18n test with i18nBundle", function( assert ) {
        assert.equal( $('#t1-1-2').html() , "¡Hola mundo!" );
        assert.equal( $('#t1-2-2').html() , "Hello world!" );
    });

    QUnit.test( "With parameters (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t2-1-2').html() , "Él no ha encontrado ningún resultado" );
        assert.equal( $('#t2-2-2').html() , "Él ha encontrado un único resultado" );
        assert.equal( $('#t2-3-2').html() , "Él ha encontrado 10 resultados" );
        assert.equal( $('#t2-4-2').html() , "Ella no ha encontrado ningún resultado" );
        assert.equal( $('#t2-5-2').html() , "Ella ha encontrado un único resultado" );
        assert.equal( $('#t2-6-2').html() , "Ella ha encontrado 10 resultados" );
        assert.equal( $('#t2-7-2').html() , "Ellos no han encontrado ningún resultado" );
        assert.equal( $('#t2-8-2').html() , "Ellos han encontrado un único resultado" );
        assert.equal( $('#t2-9-2').html() , "Ellos han encontrado 10 resultados" );
    });

    QUnit.test( "With parameters (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t3-1-2').html() , "He found no results" );
        assert.equal( $('#t3-2-2').html() , "He found 1 result" );
        assert.equal( $('#t3-3-2').html() , "He found 10 results" );
        assert.equal( $('#t3-4-2').html() , "She found no results" );
        assert.equal( $('#t3-5-2').html() , "She found 1 result" );
        assert.equal( $('#t3-6-2').html() , "She found 10 results" );
        assert.equal( $('#t3-7-2').html() , "They found no results" );
        assert.equal( $('#t3-8-2').html() , "They found 1 result" );
        assert.equal( $('#t3-9-2').html() , "They found 10 results" );
    });

    QUnit.test( "2 domains in domain definition: i18n-ES2 i18n-ES (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t4-1-2').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t4-2-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "2 domains in domain definition: i18n-EN2 i18n-EN (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t5-1-2').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t5-2-2').html() , "He found no results" );
    });

    QUnit.test( "Nested domains: i18n-ES and i18n-ES2 nested (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t6-1-2').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t6-2-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "Nested domains: i18n-EN and i18n-EN2 nested (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t7-1-2').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t7-2-2').html() , "He found no results" );
    });

    QUnit.test( "Attributes test (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t8-1-2').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-2-2').attr('title') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-3-2').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-3-2').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-4-2').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-4-2').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-4-2').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Attributes test (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t9-1-2').attr('title') , "Hello world!" );
        assert.equal( $('#t9-2-2').attr('title') , "She found 4 results" );
        assert.equal( $('#t9-3-2').attr('title') , "Hello world!" );
        assert.equal( $('#t9-3-2').attr('alt') , "She found 4 results" );
        assert.equal( $('#t9-4-2').attr('title') , "Hello world!" );
        assert.equal( $('#t9-4-2').attr('alt') , "She found 4 results" );
        assert.equal( $('#t9-4-2').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Replace (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t10-1-2').html().trim() , "¡Hola mundo!" );
        assert.equal( $('#t10-2-2').html().trim() , "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Replace (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t11-1-2').html().trim() , "Hello world!" );
        assert.equal( $('#t11-2-2').html().trim() , "He found 1 result" );
    });

    QUnit.test( "Define (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t12-1-2').html(), "¡Hola mundo!" );
        assert.equal( $('#t12-2-2').html(), "Él ha encontrado un único resultado" );
        assert.equal( $('#t12-3-2').html(), "¡Hola mundo!" );
        assert.equal( $('#t12-4-2').html(), "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Define (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t13-1-2').html(), "Hello world!" );
        assert.equal( $('#t13-2-2').html(), "He found 1 result" );
        assert.equal( $('#t13-3-2').html(), "Hello world!" );
        assert.equal( $('#t13-4-2').html(), "He found 1 result" );
    });

    QUnit.test( "On error test (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t14-1-2').html() , "¡Hola mundo!" );
        assert.equal( $('#t14-2-2').html() , "Error encontrado... Oh, noooo!" );
    });

    QUnit.test( "On error test (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t15-1-2').html() , "Hello world!" );
        assert.equal( $('#t15-2-2').html() , "Error found... Oh, noooo!" );
    });

    QUnit.test( "Numbers (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t16-1-2').html() , "1.355,23" );
        assert.equal( $('#t16-2-2').html() , "1.355,236" );
        assert.equal( $('#t16-3-2').html() , "001.355,236" );
    });

    QUnit.test( "Numbers (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t17-1-2').html() , "1,355.23" );
        assert.equal( $('#t17-2-2').html() , "1,355.236" );
        assert.equal( $('#t17-3-2').html() , "001,355.236" );
    });

    QUnit.test( "Currencies (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t18-1-2').html() , "1.355,23&nbsp;€" );
        assert.equal( $('#t18-2-2').html() , "1.355,23&nbsp;$" );
        assert.equal( $('#t18-3-2').html() , "1.355,23 euros" );
        assert.equal( $('#t18-4-2').html() , "1.355,23 dólares estadounidenses" );
    });

    QUnit.test( "Currencies (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t19-1-2').html() , "€1,355.23" );
        assert.equal( $('#t19-2-2').html() , "$1,355.23" );
        assert.equal( $('#t19-3-2').html() , "1,355.23 euros" );
        assert.equal( $('#t19-4-2').html() , "1,355.23 US dollars" );
    });

    QUnit.test( "Datetime (spanish) with i18nBundle", function( assert ) {
        assert.equal( $('#t20-1-2').html() , "20/12/2012" );
        assert.equal( $('#t20-2-2').html() , "21/12/2012" );
        assert.equal( $('#t20-3-2').html() , "jueves, 20 de diciembre de 2012" );
        assert.equal( $('#t20-4-2').html() , "viernes, 21 de diciembre de 2012" );
        assert.equal( $('#t20-5-2').html() , "4:00:00" );
        assert.equal( $('#t20-6-2').html() , "4:00:00" );
        assert.equal( $('#t20-7-2').html() , "jueves, 20 de diciembre de 2012 4:00:00" );
        assert.equal( $('#t20-8-2').html() , "viernes, 21 de diciembre de 2012 4:00:00" );
    });

    QUnit.test( "Datetime (english) with i18nBundle", function( assert ) {
        assert.equal( $('#t21-1-2').html() , "12/20/2012" );
        assert.equal( $('#t21-2-2').html() , "12/21/2012" );
        assert.equal( $('#t21-3-2').html() , "Thursday, December 20, 2012" );
        assert.equal( $('#t21-4-2').html() , "Friday, December 21, 2012" );
        assert.equal( $('#t21-5-2').html() , "4:00:00 AM" );
        assert.equal( $('#t21-6-2').html() , "4:00:00 AM" );
        assert.equal( $('#t21-7-2').html() , "Thursday, December 20, 2012, 4:00:00 AM" );
        assert.equal( $('#t21-8-2').html() , "Friday, December 21, 2012, 4:00:00 AM" );
    });
    
    QUnit.test( "An array with 2 domains in domain definition: [ i18n-ES2 i18n-ES ] (spanish)", function( assert ) {
        assert.equal( $('#t22-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t22-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "An array with 2 domains in domain definition: [ i18n-EN2 i18n-EN ] (english) ", function( assert ) {
        assert.equal( $('#t23-1').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t23-2').html() , "He found no results" );
    });
}
