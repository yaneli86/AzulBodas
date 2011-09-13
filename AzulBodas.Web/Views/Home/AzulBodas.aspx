<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<AzulBodas.Web.Models.AzulBodasModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	<%: Model.Title %>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <div class="left" style="width:320px;height:435px">
            <h1 class="heading sprite-azulbodas">AZUL BODAS</h1>
            <% Html.RenderPartial("ScrollablePanel", new AzulBodas.Web.Models.ScrollablePanelModel { Text = Model.MainText }); %>
        </div>
        <div class="right" style="margin-top:10px">
            <% Html.RenderPartial("Slides", new AzulBodas.Web.Models.SlidesModel{ FrameCssClass = "img-frame", Width = 437, Images = Model.Images}); %>
        </div>
        <div style="clear:both"></div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MetaDescription" runat="server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="MetaAuthor" runat="server">
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="ScriptsContent" runat="server">
	<script type="text/javascript" src="<%= Url.Content("~/Scripts/slides.min.jquery.js") %>"></script>
    <script type="text/javascript">
        $(function () {
            $('#slides').abSlides();
        });
    </script>
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="CssContent" runat="server">
    <link type="text/css" rel="Stylesheet" href="<%= Url.Content("~/Content/slides.css") %>" />
</asp:Content>
