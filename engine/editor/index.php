<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>JEngine Editor</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
      .sidebar-nav {
        padding: 9px 0;
      }

      @media (max-width: 980px) {
        /* Enable use of floated navbar text */
        .navbar-text.pull-right {
          float: none;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    </style>
    <link href="css/bootstrap-responsive.css" rel="stylesheet">
    <link rel="stylesheet" href="css/codemirror.css">
    <link rel="stylesheet" href="themes/eclipse.css">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="ico/apple-touch-icon-57-precomposed.png">
    <link rel="shortcut icon" href="ico/favicon.png">
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="#">Project name</a>
          <div class="nav-collapse collapse">
            <p class="navbar-text pull-right">
              Logged in as <a href="#" class="navbar-link">Username</a>
            </p>
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span3">
          <div class="well sidebar-nav">
            <ul class="nav nav-list">
              <li class="nav-header">Sprites</li>
              <li><a href="#"><img src="img/Defaults/Sprites/sun.png" width='16px' height='16px' /> spriteSun</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li class="nav-header">Objects</li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
            </ul>
          </div><!--/.well -->
        </div><!--/span-->
        <div class="span9">
          <ul class="nav nav-tabs" id="myTab" data-tabs='tabs'>
            <li class="active"><a href="#home" data-toggle="tab">Editor</a></li>
            <li class='pull-right'><a href="#home" id='justifyButton' data-toggle="tooltip" title="Beautify Code"><i class='icon-align-justify'></i></a></li>
          </ul>
<div>
  <textarea id="code" name="code"><?= file_get_contents('default.js'); ?></textarea>
</div>
        </div><!--/span-->
      </div><!--/row-->

      <hr>

    </div><!--/.fluid-container-->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/codemirror.js"></script>
    <script src="js/matchbrackets.js"></script>
    <script src="js/continuecomment.js"></script>
    <script src="js/javascript.js"></script>
    <script src="js/closetag.js"></script>
    <script src="http://jsbeautifier.org/beautify.js"></script>

    <script type="text/javascript">
      var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        matchBrackets: true,
        theme: 'eclipse',
        highlightSelectionMatches: true,
        extraKeys: {"Enter": "newlineAndIndentContinueComment"}
      });

      $('#justifyButton').hover(function (){
        $('#justifyButton').tooltip('show');
      });

      $('#justifyButton').click(function() {
        editor.setValue(js_beautify(editor.getValue(), { indent_size: 2, space_before_conditional: false }));
      });
    </script>

  </body>
</html>
