
Zenon Page Templates - JS (ZPT-JS) is a Javascript implementation of Zope Page Templates (ZPT).

Zope Page Templates are a web page generation tool. They help programmers and designers collaborate in producing dynamic web pages for Zope web applications. Designers can use them to maintain pages without having to abandon their tools, while preserving the work required to embed those pages in an application.
(from Zope2 book, http://docs.zope.org/zope2/zope2book/ZPT.html)

There are some important differences between ZPT-JS and ZPT.

Using ZPT we have:
    the ZPT template (an HTML file with the ZPT tags inside)
    the data
    the final HTML file (the ZPT template combined with the data)

Using ZPT-JS:
    the ZPT template (an HTML file with the ZPT tags inside)
    the data
    the final HTML file is the ZPT template! The DOM of the HTML page is modified depending on the tags in the ZPT template.
    
A main goal of ZPT-JS is not to break a valid HTML documents. So, as HTML5 allows, instead of using TAL attributes ZPT-JS uses data attributes. This way tal:content attribute is replaced by data-tcontent.

A sample of ZPT-JS template:

    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Some ZPT-JS examples</title>

            <script src="https://code.jquery.com/jquery-2.0.3.js"></script>
            <script src="../dist/zpt.js"></script>
            <script>

    $(function () {
        "use strict";

        var dictionary = { 
            aString: "string",
            doggy: false,
            number1: 1,
            number100: 100,
            user: {
                name: "Bob", 
                age: function( ){
                    return 25;
                }
            },
            items: [ 'item0', 'item1', 'item2' ]
        };

        zpt.run( document.body, dictionary );
    });

            </script>
        </head>
        <body>
            <h1>Some expressions</h1>
            <ol>
                <li data-tcontent="user/name">xxx</li>
                <li data-tcontent="string:help my ${user/name}">xxx</li>
                <li data-tcontent="doggy">not false</li>
                <li data-tcontent="not:doggy">not false</li>
                <li data-tcontent="eq: number1 number100">not true</li>
                <li data-tcontent="user/name | string:no friends">any friends?</li>
                <li data-tcontent="user2/name | string:no friends">any friends?</li>
                <li data-tcontent="items[0]">an item</li>
                <li data-tcontent="user/age()">user/age()</li>
            </ol>
        </body>
    </html>

Please, take a look to https://github.com/davidcana/ZPT-JS/wiki for more information about ZPT-JS.
