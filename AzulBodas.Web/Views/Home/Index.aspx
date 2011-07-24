<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<AzulBodas.Data.Model.Text>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <style type="text/css">
        .outer{padding:5px;width:300px;opacity:0.7;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=70);background-color:#5F664B}
        .inner{position:relative}
        .lnk{display:block;padding:5px}
        .lnk:hover{background-color:#5F664B}
        #nav1{margin:0;}
        #nav1 li {list-style:none;display:inline}
        #div2, #div3{display:none; position:absolute}
        #div1 {margin-top:-50px;background:yellow;width:150px;opacity:0.7;filter:alpha(opacity=70); }
        #div1 a{display:block;padding:5px 3px;}
        #div1 a:hover{background-color:Blue;position:relative}
    </style>

    <ul id="nav1">
        <li><a href="#div1">First Menu</a></li>
        <li><a href="#div2">Second Menu</a></li>
        <li><a href="#div3">Third Menu</a></li>
    </ul>

    <div id="div1" class="dropmenu">
        <div class="inner">
            <a href="#">Element 1</a>
            <a href="#">Element 2</a>
            <a href="#">Element 3</a>
            <a href="#">Element 4</a>
        </div>
    </div>

    <div id="div2" class="dropmenu">
        <a href="#">Element 1</a>
        <a href="#">Element 2</a>
        <a href="#">Element 3</a>
        <a href="#">Element 4</a>
    </div>

    <div id="div3" class="dropmenu">
        <a href="#">Element 1</a>
        <a href="#">Element 2</a>
        <a href="#">Element 3</a>
        <a href="#">Element 4</a>
    </div>


    <div class="outer" style="margin-top:20px">
        <div class="inner">
            asdlkfj as;ldfj as;ldjfasl;djf asldj fasldfjas;ldkjflas;djflsadk;j
            <a href="#" class="lnk">CLick me</a>
        </div>
    </div>
</asp:Content>
