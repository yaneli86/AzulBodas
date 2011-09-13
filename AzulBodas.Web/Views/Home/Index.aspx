<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<AzulBodas.Web.Models.HomeModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<% Html.RenderPartial("Slides", new AzulBodas.Web.Models.SlidesModel{ FrameCssClass = "img-frame-home", Width = 835, Images = Model.Images}); %>
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="ScriptsContent" runat="server">
	<script type="text/javascript" src="<%= Url.Content("~/Scripts/slides.min.jquery.js") %>"></script>
    <script type="text/javascript">
        $(function () {
            $('#slides').abSlides()
        });
</script>
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="CssContent" runat="server">
    <link type="text/css" rel="Stylesheet" href="<%= Url.Content("~/Content/slides.css") %>" />
</asp:Content>
