<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>
<!doctype html>
<!--[if lt IE 7 ]> <html class="ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html lang="en"> <!--<![endif]-->
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="<%= Url.Content("~/favicon.ico") %>" />
    <title>Azul Bodas</title>
    <style type="text/css">
        html, body, #wrapper {
           height:100%;
           width: 100%;
           margin: 0;
           padding: 0;
           border: 0;
        }
        #wrapper a {text-indent:-9999px;display:block;background: url('<%= Url.Content("~/Content/images/languages.png") %>') no-repeat top left;margin-top:45px}
        #wrapper a {float:left}
        #wrapper .sprite-english{ background-position: 0 -30px; width: 82px; height: 20px; }
        #wrapper .sprite-english:hover{ background-position: 0 0; } 
        #wrapper .sprite-spanish{ background-position: -3px -86px; width: 88px; height: 16px; }
        #wrapper .sprite-spanish:hover{ background-position: -3px -60px; }
        #wrapper {position:absolute;left:50%;top:50%;margin-left:-137px;margin-top:-52px}
    </style>
</head>
<body>
            <div id="wrapper">
                <a href="<%= Url.Action("ChangeCulture", new {lang = AzulBodas.Web.Helpers.Culture.en.ToString(), returnUrl = Request.RawUrl }) %>" class="sprite-english">English</a>
                <div style="float:left; margin:0 10px 0 10px">
                    <img src="<%= Url.Content("~/Content/images/logo-plain.png") %>" alt="language" style="display:block"/>
                    <img src="<%= Url.Content("~/Content/images/logo-plain-shadow.png") %>" alt="language"/>
                </div>
                <a href="<%= Url.Action("ChangeCulture", new {lang = AzulBodas.Web.Helpers.Culture.es.ToString(), returnUrl = Request.RawUrl }) %>" class="sprite-spanish">Espa&ntilde;ol</a>
            </div>
      
</body>
</html>
