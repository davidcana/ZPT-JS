<html>
  <head>
    <title>JSPT: User's Guide</title>
    <style>
      body { 
        background-color: white; 
        font-size: 12pt; 
        color: black; 
        font-family: arial,helvetica,verdana; 
      }
      h1 { font-size: 24pt; font-weight: bold; }
      h2 { font-size: 20pt; font-weight: bold; }
      h3 { font-size: 18pt; font-weight: bold; }
      h4 { font-size: 16pt; font-weight: bold; }
      .sub { font-size: 10pt; }
      code { color: red; }
      pre { background-color: black; color: white; padding-top: 1em; padding-left: 4em;}
    </style>
  </head>
  <body>
    <a name="top"></a>
    <h1>JSPT: User's Guide</h1>
    <div class="sub">last modified: 2015/22/04</div>
    <div class="sub">author <a href="mailto:chris@christophermrossi.com">Chris Rossi</a></div>
    <div class="sub">contributed by <a href="mailto:david.javapagetemplates@gmail.com">David Cana</a></div>

    <a name="zpt"></a>
    <h2>Zope Page Templates</h2>
    <p>
      JSPT is a Javascript implementation of Zope Page Templates (ZPT). Because JSPT
      isn't running in the context of Zope and isn't written with Python,
      there are necessarily some differences between JPT and ZPT. This document
      will concentrate on the ways that JSPT differs from ZPT. For an introduction
      to ZPT refer to the chapter 
      <a href="http://docs.zope.org/zope2/zope2book/ZPT.html">Using
      Zope Page Templates</a> in the 
      <a href="http://docs.zope.org/zope2/zope2book/">Zope Book</a>.
      For a complete reference to ZPT, refer to the 
      <a href="http://docs.zope.org/zope2/zope2book/AppendixC.html">ZPT Reference</a>.
    </p>
    
    <a name="zpt.grunt"></a>
    <h3>Grunt project</h3>
    <p>
      JSPT uses <a href="http://gruntjs.com/">Grunt</a> as task runner tool. If you know
      how a Grunt project works you can skip this chapter.
    </p>
    <p>
      If you want to test JSPT the next command lines are useful:
      <pre>
grunt concat    // Concatenate all scripts in the scripts sub-directory into a single script called dist/jspt.js
grunt uglify    // Create a file within dist/jspt.min.js that contains the result of minifying the JavaScript files
grunt compress  // Compress files and folders of this project into dist/jspt_yyyy-mm-dd_hhmm.tar.gz
      </pre>
    </p>
    
    <a name="zpt.testing"></a>
    <h3>Testing project</h3>
    <p>
      JSPT uses <a href="https://qunitjs.com/">QUnit</a> as testing framework. For testing JSPT open test/index.html with your
      favourite browser.
    </p>
    
    <a name="zpt.evaluationOrder"></a>
    <h3>Evaluation order</h3>
    <p>
      The order evaluation of attributes in JPT is not equal than ZPT's. The new order is:
      <ul>
        <li><code>data-trepeat</code></li>
        <li><code>data-ton-error</code></li>
        <li><code>data-mdefine-macro</code></li>
        <li><code>data-tdefine</code></li>
        <li><code>data-tcondition</code></li> 
        <li><code>data-tomit-tag</code></li>
        <li><code>data-treplace</code></li>
        <li><code>data-tattributes</code></li>
        <li><code>data-tcontent</code></li>
        <li>content</li>
        <li><code>data-muse-macro</code></li>
      </ul>
      The tags can be changed. Customize the <code>defaultTag</code> variable in js/app/jsptContext.js file.
      You can also use <code>jsptContext.setTags( tags )</code> to define the tags programmatically.
    </p>

    <a name="tales"></a>

    <a name="tales.path"></a>
    <h3>Path Expressions</h3>
    <p>
      The first element in a path expression must be a variable, a method call, a function call or a literal.
    </p>

    <a name="tales.path.literals"></a>
    <h4>Literals</h4>
    <p>
      Integer, float and boolean literals are defined in the same way as in the Javascript language.  
      String literals are delimited by single quotes.  Some example literals:
      <ul>
        <li><code>9</code> (integer literal)</li>
        <li><code>9.0</code> (floating point literal)</li>
        <li><code>true</code> (boolean literal)</li>
        <li><code>'foobar'</code> (string literal)</li>
      </ul>
    </p>

    <a name="tales.variables"></a>
    <h4>Variables</h4>
    <p>
      A variable is either predefined, defined
      via a <code>data-tdefine</code> attribute, or passed in to the template at runtime.  
      The following variables are predefined:
      <ul>
        <li><code>repeat</code> see <code><a href="#data-trepeat">data-trepeat</a></code></li>
      </ul>
      The <code>here</code> variable (the context) is not defined in JSPT; it is implicit. The scope of all variables in context 
      is global. Take a look to <a href="">examples</a> to understand how you can define variables of the context.<br />
      The scope of the variables defined via a <code>data-tdefine</code> attribute is local. An example:
      <pre>
&lt;div data-tdefine="a number"&gt;
    &lt;span data-treplace="a">5&lt;/span&gt;
&lt;/div&gt;
&lt;span data-treplace="a">null&lt;/span&gt;
      </pre>
      At the first replace the value in <code>number</code> will be used. At the second replace, a <code>null</code> value (the <code>a</code> variable is out of scope).<br />
      
      The following variables are defined in ZPT but not in JSPT:
      <code>here, template, resolver, options, CONTEXTS, root, container, request, user, modules</code>.  
      The following variables are defined in ZPT but aren't yet implemented in JSPT:
      <code>nothing, default, attrs</code>.  If you need these, holler.
    </p>

    <a name="tales.path.traversal"></a>
    <h4>Path traversal</h4>
    <p>
      Following the initial path element, path elements are either properties or methods
      of the preceding object. Example: <br />
      <code>object.name</code> will search for a property <code>name</code> or a method <code>name()</code>
            in the passed object.
    </p>
    <p>
      Some examples more:
      <ul>
        <li><code>object1.doSomething( 9, 8 )</code> will run <code>doSomething</code> method 
                in <code>object1</code> with <code>9</code> and <code>8</code> as arguments.</li>
        <li><code>object2.values.length</code> will run <code>values</code> method in <code>object2</code>
                and get its length.</li>
        <li><code>object3.getItem( itemName )</code> will get the item identified by <code>itemName</code>
                variable.</li>
      </ul>
      The last element in a path expression may resolve to <code>null</code>, but if an intermediate element resolves
      to <code>null</code> an <code>Exception</code> will be thrown. 
    </p>
    
    <a name="tales.path.arrays"></a>
    <h4>Arrays</h4>
    <p>
      Array members may be accessed using the same syntax as in Javascript. Any number of 
      dimensions are supported. The expression inside the array accessor may be any
      TALES expression and must evaluate to an integer value. If an array accessor
      is found modifying an object that is not an array an exception is thrown.
      <ul>
        <li><code>people[ 2 ]</code></li>
        <li><code>grid[ point / x ][ point / y ]</code></li>
      </ul>
    </p>
    
    <a name="tales.javascript"></a>
    <h3>Javascript expressions</h3>
    <p>
      Javascript expressions work just like Python expressions in ZPT except that the Javascript language
      is used instead of Python. Any legal Javascript expression may be evaluated.
      Some examples:
      <ul>
        <li><code>js: 4 + 5</code> returns the int 9</li>
        <li><code>js: ${aNumber} + 1</code> returns the result of adding 1 to the value of <code>aNumber</code> variable.</li>
      </ul>
    </p>
      
    <a name="tales.java.variables"></a>
    <h4>Variables</h4>
    
    <a name="tales.exists"></a>
    <h3>Exists expressions</h3>
    <p>
      It evaluates as a boolean expression. If the expression is any of the next:
      <ul>
        <li><code>undefined</code></li>
        <li><code>null</code></li>
        <li><code>'false'</code></li>
        <li><code>false</code></li>
        <li><code>0</code></li>
      </ul>
       the expression evaluates to <code>false</code>. Otherwise the expression evaluates to <code>true</code>.
    </p>

    <a name="tales.not"></a>
    <h3>Not expressions</h3>
    <p>
      Not expressions work more or less like in ZPT. The expression to which <code>not:</code>
      is applied must first be cast to a boolean. The result is then negated.
    </p>
    
    <a name="tales.math">
    <h3>Math expressions</h3>
    <p>
      You can do some math operations using this expressions:
      <ul>
        <li><code>+: x y</code> -> add x and y</li>
        <li><code>-: x y</code> -> subtract y from x</li>
        <li><code>*: x y</code> -> multiply x and y</li>
        <li><code>:: x y</code> -> divide x by y</li>
        <li><code>%: x y</code> -> x mod y</li>
      </ul>
      In all cases, <code>x</code> and <code>y</code> are assumed integers. You can use more than 2 values to operate. 
      You can use parenthesis. Some examples:
      <ul>
        <li><code>-: assets liabilities</code></li>
        <li><code>*: 2 children</code></li>
        <li><code>+: 1 number1 number2</code></li>
        <li><code>+: 1 ( *: number1 number2 )</code></li>
      </ul>
    </p>
    
    <a name="tales.bool">
    <h3>Boolean expressions</h3>
    <p>
      The list of available boolean expressions are:
      <ul>
        <li><code>or: x y</code> -> boolean or of expressions x and y</li>
        <li><code>and: x y</code> -> boolean and of expressions x and y</li>
        <li><code>cond: x y z</code> -> evaluate as boolean x; if true return y, otherwise return z</li>
      </ul>
      All operators uses lazy evaluation. OR and AND expressions support 2 or more operators. COND expression only support 3. An example:
      <ul>
        <li><code>&lt;p data-tcondition="and: ( exists:here/pets/dog ) ( not:here/pets/dog/badDog )"&gt;
                  Good Dog&lt;/p&gt;</code></li>
        <li><code>&lt;p data-tcondition="or: isFridayNight isSaturday isSunday"&gt;
                  Yeah!&lt;/p&gt;</code></li>
        <li><code>&lt;p data-tcontent="cond: isFridayNight 'Yeah!' 'Oh!'"&gt;
                  What?&lt;/p&gt;</code></li>
      </ul>
    <p>
    
    <a name="tales.comparison">
    <h3>Comparison expressions</h3>
    <p>
      The 3 available comparison expressions are:
      <ul>
        <li><code>equals:</code> Checks if 2 or more integers are equals. If the values are not numbers, it checks if they are equals.</li>
        <li><code>greater:</code> Checks if a number is greater than another.</li>
        <li><code>lower:</code> Checks if a number is lower than another.</li>
      </ul>
      Some examples:
      <ul>
        <li><code>equals: assets liabilities anObject</code></li>
        <li><code>greater: 10 ( +: children pets )</code></li>
      </ul>
    </p>
    
    <a name="tales.other"></a>
    <h3>Other expressions</h3>
    <p>
      String expressions behave exactly as in ZPT. Python expressions are not
      supported in JSPT.
    </p>

    <a name="tal"></a>
    <h2>TAL Statements</h2>
    <p>
      All TAL statements behave almost exactly as in ZPT, except for <code>tal:no-call</code> which
      is not yet implemented (if you need it, holler). <code>data-tcondition (tal:condition in ZPT)</code> and 
      <code>data-tomit-tag (tal:omit-tag in ZPT)</code> must cast their expression to a boolean, which follows the rules
      described for <a href="#tales.not">Not expressions</a>.
    </p>

    <a name="tal.repeat"></a>
    <h3>Repeat expressions</h3>
    <p>
      There are a few minor variations for <code>tal:repeat</code>. The repeat expression must 
      evaluate to an array. The repeat variables <code>Letter</code> and <code>Roman</code> have been changed in JSPT to
      <code>capitalLetter</code> and <code>capitalRoman</code>.  
    </p>
    
    <a name="tal.range"></a>
    <h4>Lists expressions</h4>
      <p>
        A list is defined as an enumeration of items in brackets. Some examples:
      <ul>
        <li><code>[1 2 3]</code> evaluates as 1,2,3</li>
        <li><code>[1 2 3 number1]</code> evaluates as 1,2,3,1 (if the value of <code>number1</code> is 1)</li>
      </ul>
      You can iterate through lists using loops:
      <ul>
        <li><code>data-trepeat="c [10 20 30]"</code> iterates using <code>c</code> 10, 20 and 30 values</li>
        <li><code>data-trepeat="mixed ['yes!' 'no!' aNumber]"</code> iterates using <code>mixed</code></li>
      </ul>
      Another way of using lists is as range expressions:
      <ul>
        <li><code>data-trepeat="c [1:5]"</code> iterates using <code>c</code> 1,2,3,4 and 5 values</li>
        <li><code>data-trepeat="c [1:7:2]"</code> iterates using <code>c</code> 1,3,5 and 7 values</li>
        <li><code>data-trepeat="c [:5]"</code> iterates using <code>c</code> 0,1,2,3,4 and 5 values</li>
      </ul>
    </p>
    
    <a name="metal"></a>
    <h2>METAL</h2>
    <p>
      METAL statements behave exactly as in ZPT. The only difference, which is really a difference
      in Path expressions, is the means of finding another template which contains macros. Since,
      there is no Zope tree in which to locate templates, templates must be resolved via a URI.  
      The predefined variable, <code>resolver</code>, holds a reference to an instance of 
      <code>Resolver</code> which can be used to resolve references to external templates.
     </p>
     <p>
       The <code>Resolver</code> class contains these methods:
       <ul>
         <li>getPageTemplate( String uri )</li>
         <li>getResource( String uri )</li>
         <li>getScript( String uri )</li>
       </ul>
       The <code>getPageTemplate</code> method returns a <code>PageTemplate</code> instance which can then
       be used for macro processing. <code>getScript</code> returns 
       <a href="#tales.java.scripts">script</a> that is then executed.  
       <code>getResource</code> is there in case anyone needs a more generic resource
       finding method and returns a <code>URL</code>. If the URI passed to these methods is relative
       it will be resolved relative to the URI of the current template.  
     </p>
     <p>
       For example:<br>
       <pre>
&lt;html metal:use-macro="resolver/getPageTemplate( '../base.jpt' )/macros/page"&gt;
  &lt;div metal:fill-slot="content"&gt;
    This is the content for my web page.
  &lt;/div&gt;
&lt;/html&gt;
       </pre>
     </p>

    <a name="moreExamples">
    <h2>More examples</h2>
    <p>
      Please, take a look to test files in <code>test/</code> to view more JSPT examples.
      
     <a name="invocation"></a>
     <h2>Invoking Page Templates</h2>
     <p>
       There are 2 available implementations of JPT. The first one is PageTemplateImpl, that makes all the job in one phase, reading the JPT file and generating the output simultaneously. The second one is TwoPhasesPageTemplateImpl, that divides the job in two phases:
       <ul>
         <li>A first phase reading the JPT and generating a java representation.</li>
         <li>A second phase reading the java representation and generating the real output.</li>
       </ul>
       It is recommended to use the two phases implementation, the performance is better and new enhancements could only be available in that one.
     </p>
     <p>
       But, how can we use JPT? The <code>context</code> may be any Java object.  This is the same object referred to by <code>here</code> in path expressions.  The <code>dictionary</code> is optional and may be used to define variables for use by the template.
     </p>
     <p>
       An example of invoking a PageTemplate from a Servlet:
     <pre>
public class MyServlet extends HttpServlet {
    public void service( HttpServletRequest request, HttpServletResponse response )
        throws ServletException, IOException
    {
        // Some business logic here. . . .
        User user = . . . 
        Record record = . . .

        // Response to user
        try {
        // Find and instantiate template, located in the record directory
            // under our web application root.
            URL templateURL = getServletContext().getResource( "record/showrecord.jpt" );
            PageTemplate template = new TwoPhasesPageTemplateImpl( templateURL );

            // Initialize some variables to be used by the template
            Map dictionary = new HashMap();
            dictionary.put( "request", request );
            dictionary.put( "user", user );

            // Output response
            OutputStream output = response.getOutputStream();
    	    response.setContentType( "text/html" );
            template.process( output, record, dictionary );
            output.close();
            
        } catch( PageTemplateException e ) {
            // Oh no!
            throw new ServletException( e );
        }
    }
}
    </pre>
    </p>
  </body>
</html>
     
