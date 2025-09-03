//var zz = require( 'zzdom' );
//const { i18nHelper } = require('../../../js/app/main');
import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { i18nHelper } from '../../../js/app/i18n/i18nHelper.js';

export const i18nTests = function( dictionary ){
    
    QUnit.test( "Simple i18n test", function( assert ) {
        assert.equal( zz('#t1-1').html() , "¡Hola mundo!" );
        assert.equal( zz('#t1-2').html() , "Hello world!" );
    });

    QUnit.test( "With parameters (spanish)", function( assert ) {
        assert.equal( zz('#t2-1').html() , "Él no ha encontrado ningún resultado" );
        assert.equal( zz('#t2-2').html() , "Él ha encontrado un único resultado" );
        assert.equal( zz('#t2-3').html() , "Él ha encontrado 10 resultados" );
        assert.equal( zz('#t2-4').html() , "Ella no ha encontrado ningún resultado" );
        assert.equal( zz('#t2-5').html() , "Ella ha encontrado un único resultado" );
        assert.equal( zz('#t2-6').html() , "Ella ha encontrado 10 resultados" );
        assert.equal( zz('#t2-7').html() , "Ellos no han encontrado ningún resultado" );
        assert.equal( zz('#t2-8').html() , "Ellos han encontrado un único resultado" );
        assert.equal( zz('#t2-9').html() , "Ellos han encontrado 10 resultados" );
    });

    QUnit.test( "With parameters (english)", function( assert ) {
        assert.equal( zz('#t3-1').html() , "He found no results" );
        assert.equal( zz('#t3-2').html() , "He found 1 result" );
        assert.equal( zz('#t3-3').html() , "He found 10 results" );
        assert.equal( zz('#t3-4').html() , "She found no results" );
        assert.equal( zz('#t3-5').html() , "She found 1 result" );
        assert.equal( zz('#t3-6').html() , "She found 10 results" );
        assert.equal( zz('#t3-7').html() , "They found no results" );
        assert.equal( zz('#t3-8').html() , "They found 1 result" );
        assert.equal( zz('#t3-9').html() , "They found 10 results" );
    });

    QUnit.test( "2 domains in domain definition: i18nES2 i18nES1 (spanish)", function( assert ) {
        assert.equal( zz('#t4-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( zz('#t4-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "2 domains in domain definition: i18nEN2 i18nEN1 (english) ", function( assert ) {
        assert.equal( zz('#t5-1').html() , "Hello world 2.0!!!" );
        assert.equal( zz('#t5-2').html() , "He found no results" );
    });

    QUnit.test( "Nested domains: i18nES1 and i18nES2 nested (spanish) ", function( assert ) {
        assert.equal( zz('#t6-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( zz('#t6-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "Nested domains: i18nEN1 and i18nEN2 nested (english) ", function( assert ) {
        assert.equal( zz('#t7-1').html() , "Hello world 2.0!!!" );
        assert.equal( zz('#t7-2').html() , "He found no results" );
    });

    QUnit.test( "Attributes test (spanish)", function( assert ) {
        assert.equal( zz('#t8-1').attr('title') , "¡Hola mundo!" );
        assert.equal( zz('#t8-2').attr('title') , "Ella ha encontrado 4 resultados" );
        assert.equal( zz('#t8-3').attr('title') , "¡Hola mundo!" );
        assert.equal( zz('#t8-3').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( zz('#t8-4').attr('title') , "¡Hola mundo!" );
        assert.equal( zz('#t8-4').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( zz('#t8-4').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Attributes test (english)", function( assert ) {
        assert.equal( zz('#t9-1').attr('title') , "Hello world!" );
        assert.equal( zz('#t9-2').attr('title') , "She found 4 results" );
        assert.equal( zz('#t9-3').attr('title') , "Hello world!" );
        assert.equal( zz('#t9-3').attr('alt') , "She found 4 results" );
        assert.equal( zz('#t9-4').attr('title') , "Hello world!" );
        assert.equal( zz('#t9-4').attr('alt') , "She found 4 results" );
        assert.equal( zz('#t9-4').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Replace (spanish) ", function( assert ) {
        assert.equal( zz('#t10-1').html().trim() , "¡Hola mundo!" );
        assert.equal( zz('#t10-2').html().trim() , "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Replace (english) ", function( assert ) {
        assert.equal( zz('#t11-1').html().trim() , "Hello world!" );
        assert.equal( zz('#t11-2').html().trim() , "He found 1 result" );
    });

    QUnit.test( "Define (spanish) ", function( assert ) {
        assert.equal( zz('#t12-1').html(), "¡Hola mundo!" );
        assert.equal( zz('#t12-2').html(), "Él ha encontrado un único resultado" );
        assert.equal( zz('#t12-3').html(), "¡Hola mundo!" );
        assert.equal( zz('#t12-4').html(), "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Define (english) ", function( assert ) {
        assert.equal( zz('#t13-1').html(), "Hello world!" );
        assert.equal( zz('#t13-2').html(), "He found 1 result" );
        assert.equal( zz('#t13-3').html(), "Hello world!" );
        assert.equal( zz('#t13-4').html(), "He found 1 result" );
    });

    QUnit.test( "On error test (spanish)", function( assert ) {
        assert.equal( zz('#t14-1').html() , "¡Hola mundo!" );
        assert.equal( zz('#t14-2').html() , "Error encontrado... Oh, noooo!" );
    });

    QUnit.test( "On error test (english)", function( assert ) {
        assert.equal( zz('#t15-1').html() , "Hello world!" );
        assert.equal( zz('#t15-2').html() , "Error found... Oh, noooo!" );
    });

    QUnit.test( "Numbers (spanish)", function( assert ) {
        assert.ok( [ "1.355,23", "1355,23" ].indexOf( zz('#t16-1').html() != -1 ) );
        //assert.equal( zz('#t16-1').html() , "1.355,23", "this is a test 1!" );
        assert.ok( [ "1.355,236", "1355,236" ].indexOf( zz('#t16-2').html() != -1 ) );
        //assert.equal( zz('#t16-2').html() , "1.355,236", "this is a test 2!" );
        assert.ok( [ "001.355,236", "1.355,236" ].indexOf( zz('#t16-3').html() != -1 ) );
        //assert.equal( zz('#t16-3').html() , "001.355,236" );
    });

    QUnit.test( "Numbers (english)", function( assert ) {
        assert.equal( zz('#t17-1').html() , "1,355.23" );
        assert.equal( zz('#t17-2').html() , "1,355.236" );
        assert.ok( [ "001,355.236", "1,355.236" ].indexOf( zz('#t17-3').html() ) != -1 );
        //assert.equal( zz('#t17-3').html() , "001,355.236" );
    });

    QUnit.test( "Currencies (spanish)", function( assert ) {
        assert.ok( [ "1.355,23&nbsp;€", "1.355,23", "1355,23" ].indexOf( zz('#t18-1').html() ) != -1 );
        assert.ok( [ "1.355,23&nbsp;US$", "1.355,23", "1355,23" ].indexOf( zz('#t18-2').html() ) != -1 );
        assert.ok( [ "1.355,23 euros", "1.355,23", "1355,23" ].indexOf( zz('#t18-3').html() ) != -1 );
        assert.ok( [ "1.355,23 dólares estadounidenses", "1.355,23", "1355,23" ].indexOf( zz('#t18-4').html() ) != -1 );
        //assert.equal( zz('#t18-1').html() , "1.355,23&nbsp;€" );
        //assert.equal( zz('#t18-2').html() , "1.355,23&nbsp;US$" );
        //assert.equal( zz('#t18-3').html() , "1.355,23 euros" );
        //assert.equal( zz('#t18-4').html() , "1.355,23 dólares estadounidenses" );
    });

    QUnit.test( "Currencies (english)", function( assert ) {
        assert.ok( [ "€1,355.23", "1,355.23" ].indexOf( zz('#t19-1').html() ) != -1 );
        assert.ok( [ "$1,355.23", "1,355.23" ].indexOf( zz('#t19-2').html() ) != -1 );
        assert.ok( [ "1,355.23 euros", "1,355.23" ].indexOf( zz('#t19-3').html() ) != -1 );
        assert.ok( [ "1,355.23 US dollars", "1,355.23" ].indexOf( zz('#t19-4').html() ) != -1 );
        //assert.equal( zz('#t19-1').html() , "€1,355.23" );
        //assert.equal( zz('#t19-2').html() , "$1,355.23" );
        //assert.equal( zz('#t19-3').html() , "1,355.23 euros" );
        //assert.equal( zz('#t19-4').html() , "1,355.23 US dollars" );
    });

    QUnit.test( "Datetime (spanish)", function( assert ) {
        assert.equal( zz('#t20-1').html() , "20/12/2012" );
        assert.equal( zz('#t20-2').html() , "21/12/2012" );
        assert.ok( [ "jueves, 20 de diciembre de 2012", "20/12/2012" ].indexOf( zz('#t20-3').html() ) != -1 );
        assert.ok( [ "viernes, 21 de diciembre de 2012", "21/12/2012" ].indexOf( zz('#t20-4').html() ) != -1 );
        assert.ok( [ "4:00:00", "20/12/2012" ].indexOf( zz('#t20-5').html() ) != -1 );
        assert.ok( [ "4:00:00", "21/12/2012" ].indexOf( zz('#t20-6').html() ) != -1 );
        assert.ok( [ "jueves, 20 de diciembre de 2012 4:00:00", "20/12/2012" ].indexOf( zz('#t20-7').html() ) != -1 );
        assert.ok( [ "viernes, 21 de diciembre de 2012 4:00:00", "21/12/2012" ].indexOf( zz('#t20-8').html() ) != -1 );
        //assert.equal( zz('#t20-3').html() , "jueves, 20 de diciembre de 2012" );
        //assert.equal( zz('#t20-4').html() , "viernes, 21 de diciembre de 2012" );
        //assert.equal( zz('#t20-5').html() , "4:00:00" );
        //assert.equal( zz('#t20-6').html() , "4:00:00" );
        //assert.equal( zz('#t20-7').html() , "jueves, 20 de diciembre de 2012 4:00:00" );
        //assert.equal( zz('#t20-8').html() , "viernes, 21 de diciembre de 2012 4:00:00" );
    });

    QUnit.test( "Datetime (english)", function( assert ) {
        assert.equal( zz('#t21-1').html() , "12/20/2012" );
        assert.equal( zz('#t21-2').html() , "12/21/2012" );
        assert.ok( [ "Thursday, December 20, 2012", "12/20/2012" ].indexOf( zz('#t21-3').html() ) != -1 );
        assert.ok( [ "Friday, December 21, 2012", "12/21/2012" ].indexOf( zz('#t21-4').html() ) != -1 );
        assert.ok( [ "4:00:00 AM", "12/20/2012" ].indexOf( zz('#t21-5').html() ) != -1 );
        assert.ok( [ "4:00:00 AM", "12/21/2012" ].indexOf( zz('#t21-6').html() ) != -1 );
        assert.ok( [ "Thursday, December 20, 2012, 4:00:00 AM", "12/20/2012" ].indexOf( zz('#t21-7').html() ) != -1 );
        assert.ok( [ "Friday, December 21, 2012, 4:00:00 AM", "12/21/2012" ].indexOf( zz('#t21-8').html() ) != -1 );
        //assert.equal( zz('#t21-3').html() , "Thursday, December 20, 2012" );
        //assert.equal( zz('#t21-4').html() , "Friday, December 21, 2012" );
        //assert.equal( zz('#t21-5').html() , "4:00:00 AM" );
        //assert.equal( zz('#t21-6').html() , "4:00:00 AM" );
        //assert.equal( zz('#t21-7').html() , "Thursday, December 20, 2012, 4:00:00 AM" );
        //assert.equal( zz('#t21-8').html() , "Friday, December 21, 2012, 4:00:00 AM" );
    });

    QUnit.test( "Simple i18n test with i18nBundle1", function( assert ) {
        assert.equal( zz('#t1-1-2').html() , "¡Hola mundo!" );
        assert.equal( zz('#t1-2-2').html() , "Hello world!" );
    });

    QUnit.test( "With parameters (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t2-1-2').html() , "Él no ha encontrado ningún resultado" );
        assert.equal( zz('#t2-2-2').html() , "Él ha encontrado un único resultado" );
        assert.equal( zz('#t2-3-2').html() , "Él ha encontrado 10 resultados" );
        assert.equal( zz('#t2-4-2').html() , "Ella no ha encontrado ningún resultado" );
        assert.equal( zz('#t2-5-2').html() , "Ella ha encontrado un único resultado" );
        assert.equal( zz('#t2-6-2').html() , "Ella ha encontrado 10 resultados" );
        assert.equal( zz('#t2-7-2').html() , "Ellos no han encontrado ningún resultado" );
        assert.equal( zz('#t2-8-2').html() , "Ellos han encontrado un único resultado" );
        assert.equal( zz('#t2-9-2').html() , "Ellos han encontrado 10 resultados" );
    });

    QUnit.test( "With parameters (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t3-1-2').html() , "He found no results" );
        assert.equal( zz('#t3-2-2').html() , "He found 1 result" );
        assert.equal( zz('#t3-3-2').html() , "He found 10 results" );
        assert.equal( zz('#t3-4-2').html() , "She found no results" );
        assert.equal( zz('#t3-5-2').html() , "She found 1 result" );
        assert.equal( zz('#t3-6-2').html() , "She found 10 results" );
        assert.equal( zz('#t3-7-2').html() , "They found no results" );
        assert.equal( zz('#t3-8-2').html() , "They found 1 result" );
        assert.equal( zz('#t3-9-2').html() , "They found 10 results" );
    });

    QUnit.test( "2 domains in domain definition: i18nES2 i18nES1 (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t4-1-2').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( zz('#t4-2-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "2 domains in domain definition: i18nEN2 i18nEN1 (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t5-1-2').html() , "Hello world 2.0!!!" );
        assert.equal( zz('#t5-2-2').html() , "He found no results" );
    });

    QUnit.test( "Nested domains: i18nES1 and i18nES2 nested (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t6-1-2').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( zz('#t6-2-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "Nested domains: i18nEN1 and i18nEN2 nested (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t7-1-2').html() , "Hello world 2.0!!!" );
        assert.equal( zz('#t7-2-2').html() , "He found no results" );
    });

    QUnit.test( "Attributes test (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t8-1-2').attr('title') , "¡Hola mundo!" );
        assert.equal( zz('#t8-2-2').attr('title') , "Ella ha encontrado 4 resultados" );
        assert.equal( zz('#t8-3-2').attr('title') , "¡Hola mundo!" );
        assert.equal( zz('#t8-3-2').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( zz('#t8-4-2').attr('title') , "¡Hola mundo!" );
        assert.equal( zz('#t8-4-2').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( zz('#t8-4-2').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Attributes test (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t9-1-2').attr('title') , "Hello world!" );
        assert.equal( zz('#t9-2-2').attr('title') , "She found 4 results" );
        assert.equal( zz('#t9-3-2').attr('title') , "Hello world!" );
        assert.equal( zz('#t9-3-2').attr('alt') , "She found 4 results" );
        assert.equal( zz('#t9-4-2').attr('title') , "Hello world!" );
        assert.equal( zz('#t9-4-2').attr('alt') , "She found 4 results" );
        assert.equal( zz('#t9-4-2').attr('longdesc') , "http://www.fsf.org" );
    });

    QUnit.test( "Replace (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t10-1-2').html().trim() , "¡Hola mundo!" );
        assert.equal( zz('#t10-2-2').html().trim() , "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Replace (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t11-1-2').html().trim() , "Hello world!" );
        assert.equal( zz('#t11-2-2').html().trim() , "He found 1 result" );
    });

    QUnit.test( "Define (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t12-1-2').html(), "¡Hola mundo!" );
        assert.equal( zz('#t12-2-2').html(), "Él ha encontrado un único resultado" );
        assert.equal( zz('#t12-3-2').html(), "¡Hola mundo!" );
        assert.equal( zz('#t12-4-2').html(), "Él ha encontrado un único resultado" );
    });

    QUnit.test( "Define (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t13-1-2').html(), "Hello world!" );
        assert.equal( zz('#t13-2-2').html(), "He found 1 result" );
        assert.equal( zz('#t13-3-2').html(), "Hello world!" );
        assert.equal( zz('#t13-4-2').html(), "He found 1 result" );
    });

    QUnit.test( "On error test (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t14-1-2').html() , "¡Hola mundo!" );
        assert.equal( zz('#t14-2-2').html() , "Error encontrado... Oh, noooo!" );
    });

    QUnit.test( "On error test (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t15-1-2').html() , "Hello world!" );
        assert.equal( zz('#t15-2-2').html() , "Error found... Oh, noooo!" );
    });

    QUnit.test( "Numbers (spanish) with i18nBundle1", function( assert ) {
        assert.ok( [ "1.355,23", "1355,23" ].indexOf( zz('#t16-1-2').html() != -1 ) );
        //assert.equal( zz('#t16-1-2').html() , "1.355,23", "test 1" );
        assert.ok( [ "1.355,236", "1355,236" ].indexOf( zz('#t16-1-2').html() != -1 ) );
        //assert.equal( zz('#t16-2-2').html() , "1.355,236", "test 2" );
        assert.ok( [ "001.355,236", "1.355,236" ].indexOf( zz('#t16-3-2').html() != -1 ) );
        //assert.equal( zz('#t16-3-2').html() , "001.355,236" );
    });

    QUnit.test( "Numbers (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t17-1-2').html() , "1,355.23" );
        assert.equal( zz('#t17-2-2').html() , "1,355.236" );
        assert.ok( [ "001,355.236", "1,355.236" ].indexOf( zz('#t17-3-2').html() ) != -1 );
        //assert.equal( zz('#t17-3-2').html() , "001,355.236" );
    });

    QUnit.test( "Currencies (spanish) with i18nBundle1", function( assert ) {
        assert.ok( [ "1.355,23&nbsp;€", "1.355,23", "1355,23" ].indexOf( zz('#t18-1-2').html() ) != -1 );
        assert.ok( [ "1.355,23&nbsp;US$", "1.355,23", "1355,23" ].indexOf( zz('#t18-2-2').html() ) != -1 );
        assert.ok( [ "1.355,23 euros", "1.355,23", "1355,23" ].indexOf( zz('#t18-3-2').html() ) != -1 );
        assert.ok( [ "1.355,23 dólares estadounidenses", "1.355,23", "1355,23" ].indexOf( zz('#t18-4-2').html() ) != -1 );
        //assert.equal( zz('#t18-1-2').html() , "1.355,23&nbsp;€" );
        //assert.equal( zz('#t18-2-2').html() , "1.355,23&nbsp;US$" );
        //assert.equal( zz('#t18-3-2').html() , "1.355,23 euros" );
        //assert.equal( zz('#t18-4-2').html() , "1.355,23 dólares estadounidenses" );
    });

    QUnit.test( "Currencies (english) with i18nBundle1", function( assert ) {
        assert.ok( [ "€1,355.23", "1,355.23" ].indexOf( zz('#t19-1-2').html() ) != -1 );
        assert.ok( [ "$1,355.23", "1,355.23" ].indexOf( zz('#t19-2-2').html() ) != -1 );
        assert.ok( [ "1,355.23 euros", "1,355.23" ].indexOf( zz('#t19-3-2').html() ) != -1 );
        assert.ok( [ "1,355.23 US dollars", "1,355.23" ].indexOf( zz('#t19-4-2').html() ) != -1 );
        //assert.equal( zz('#t19-1-2').html() , "€1,355.23" );
        //assert.equal( zz('#t19-2-2').html() , "$1,355.23" );
        //assert.equal( zz('#t19-3-2').html() , "1,355.23 euros" );
        //assert.equal( zz('#t19-4-2').html() , "1,355.23 US dollars" );
    });

    QUnit.test( "Datetime (spanish) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t20-1-2').html() , "20/12/2012" );
        assert.equal( zz('#t20-2-2').html() , "21/12/2012" );
        assert.ok( [ "jueves, 20 de diciembre de 2012", "20/12/2012" ].indexOf( zz('#t20-3-2').html() ) != -1 );
        assert.ok( [ "viernes, 21 de diciembre de 2012", "21/12/2012" ].indexOf( zz('#t20-4-2').html() ) != -1 );
        assert.ok( [ "4:00:00", "20/12/2012" ].indexOf( zz('#t20-5-2').html() ) != -1 );
        assert.ok( [ "4:00:00", "21/12/2012" ].indexOf( zz('#t20-6-2').html() ) != -1 );
        assert.ok( [ "jueves, 20 de diciembre de 2012 4:00:00", "20/12/2012" ].indexOf( zz('#t20-7-2').html() ) != -1 );
        assert.ok( [ "viernes, 21 de diciembre de 2012 4:00:00", "21/12/2012" ].indexOf( zz('#t20-8-2').html() ) != -1 );
        //assert.equal( zz('#t20-3-2').html() , "jueves, 20 de diciembre de 2012" );
        //assert.equal( zz('#t20-4-2').html() , "viernes, 21 de diciembre de 2012" );
        //assert.equal( zz('#t20-5-2').html() , "4:00:00" );
        //assert.equal( zz('#t20-6-2').html() , "4:00:00" );
        //assert.equal( zz('#t20-7-2').html() , "jueves, 20 de diciembre de 2012 4:00:00" );
        //assert.equal( zz('#t20-8-2').html() , "viernes, 21 de diciembre de 2012 4:00:00" );
    });

    QUnit.test( "Datetime (english) with i18nBundle1", function( assert ) {
        assert.equal( zz('#t21-1-2').html() , "12/20/2012" );
        assert.equal( zz('#t21-2-2').html() , "12/21/2012" );
        assert.ok( [ "Thursday, December 20, 2012", "12/20/2012" ].indexOf( zz('#t21-3-2').html() ) != -1 );
        assert.ok( [ "Friday, December 21, 2012", "12/21/2012" ].indexOf( zz('#t21-4-2').html() ) != -1 );
        assert.ok( [ "4:00:00 AM", "12/20/2012" ].indexOf( zz('#t21-5-2').html() ) != -1 );
        assert.ok( [ "4:00:00 AM", "12/21/2012" ].indexOf( zz('#t21-6-2').html() ) != -1 );
        assert.ok( [ "Thursday, December 20, 2012, 4:00:00 AM", "12/20/2012" ].indexOf( zz('#t21-7-2').html() ) != -1 );
        assert.ok( [ "Friday, December 21, 2012, 4:00:00 AM", "12/21/2012" ].indexOf( zz('#t21-8-2').html() ) != -1 );
        //assert.equal( zz('#t21-3-2').html() , "Thursday, December 20, 2012" );
        //assert.equal( zz('#t21-4-2').html() , "Friday, December 21, 2012" );
        //assert.equal( zz('#t21-5-2').html() , "4:00:00 AM" );
        //assert.equal( zz('#t21-6-2').html() , "4:00:00 AM" );
        //assert.equal( zz('#t21-7-2').html() , "Thursday, December 20, 2012, 4:00:00 AM" );
        //assert.equal( zz('#t21-8-2').html() , "Friday, December 21, 2012, 4:00:00 AM" );
    });

    QUnit.test( "An array with 2 domains in domain definition: [ i18nES2 i18nES1 ] (spanish)", function( assert ) {
        assert.equal( zz('#t22-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( zz('#t22-2').html() , "Él no ha encontrado ningún resultado" );
    });

    QUnit.test( "An array with 2 domains in domain definition: [ i18nEN2 i18nEN1 ] (english) ", function( assert ) {
        assert.equal( zz('#t23-1').html() , "Hello world 2.0!!!" );
        assert.equal( zz('#t23-2').html() , "He found no results" );
    });

    QUnit.test( "i18nHelper.tr (spanish)", function( assert ) {
        const i18nList = [ dictionary.i18nES1, dictionary.i18nES2 ];
        
        // Search for an id
        assert.equal(
            i18nHelper.tr( i18nList, 'option1', {}, 'string' ),
            "Ésta es la opción 1"
        );
        assert.equal(
            i18nHelper.tr( i18nList, 'option2', {}, 'string' ),
            "Ésta es la opción 2"
        );

        // Search for 2 ids, the first is not found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId', 'option1'], {}, 'string' ),
            "Ésta es la opción 1"
        );

        // Search for 2 ids, the first is found
        assert.equal(
            i18nHelper.tr( i18nList, ['option1', 'notFoundId'], {}, 'string' ),
            "Ésta es la opción 1"
        );

        // Search for 2 ids, both are found
        assert.equal(
            i18nHelper.tr( i18nList, ['option1', 'option2'], {}, 'string' ),
            "Ésta es la opción 1"
        );
        assert.equal(
            i18nHelper.tr( i18nList, ['option2', 'option2'], {}, 'string' ),
            "Ésta es la opción 2"
        );

        // Search for 3 ids, the third is found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId1', 'notFoundId2', 'option1'], {}, 'string' ),
            "Ésta es la opción 1"
        );

        // Search for 1 id: not found
        assert.equal(
            i18nHelper.tr( i18nList, 'notFoundId1', {}, 'string' ),
            "I18n resource \"notFoundId1\" not found!"
        );
        
        // Search for 2 ids: not found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId1', 'notFoundId2'], {}, 'string' ),
            "I18n resource \"notFoundId1,notFoundId2\" not found!"
        );

        // Search for 3 ids: not found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId1', 'notFoundId2', 'notFoundId3'], {}, 'string' ),
            "I18n resource \"notFoundId1,notFoundId2,notFoundId3\" not found!"
        );
    });

    QUnit.test( "i18nHelper.tr (english)", function( assert ) {
        const i18nList = [ dictionary.i18nEN1, dictionary.i18nEN2 ];
        
        // Search for an id
        assert.equal(
            i18nHelper.tr( i18nList, 'option1', {}, 'string' ),
            "This is option 1"
        );
        assert.equal(
            i18nHelper.tr( i18nList, 'option2', {}, 'string' ),
            "This is option 2"
        );

        // Search for 2 ids, the first is not found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId', 'option1'], {}, 'string' ),
            "This is option 1"
        );

        // Search for 2 ids, the first is found
        assert.equal(
            i18nHelper.tr( i18nList, ['option1', 'notFoundId'], {}, 'string' ),
            "This is option 1"
        );
        
        // Search for 2 ids, both are found
        assert.equal(
            i18nHelper.tr( i18nList, ['option1', 'option2'], {}, 'string' ),
            "This is option 1"
        );
        assert.equal(
            i18nHelper.tr( i18nList, ['option2', 'option2'], {}, 'string' ),
            "This is option 2"
        );

        // Search for 3 ids, the third is found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId1', 'notFoundId2', 'option1'], {}, 'string' ),
            "This is option 1"
        );

        // Search for 1 id: not found
        assert.equal(
            i18nHelper.tr( i18nList, 'notFoundId1', {}, 'string' ),
            "I18n resource \"notFoundId1\" not found!"
        );
        
        // Search for 2 ids: not found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId1', 'notFoundId2'], {}, 'string' ),
            "I18n resource \"notFoundId1,notFoundId2\" not found!"
        );

        // Search for 3 ids: not found
        assert.equal(
            i18nHelper.tr( i18nList, ['notFoundId1', 'notFoundId2', 'notFoundId3'], {}, 'string' ),
            "I18n resource \"notFoundId1,notFoundId2,notFoundId3\" not found!"
        );
    });
};
