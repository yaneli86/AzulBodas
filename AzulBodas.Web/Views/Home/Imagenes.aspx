<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<AzulBodas.Web.Models.GalleryModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Imagenes
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <div class="left" style="width:320px;height:435px">
            <div id="submenu">
                <% Html.RenderPartial("SubMenuNavigation", "imagenes"); %>
            </div>
            <div id="thumbs">
            
            </div>
        </div>
        <div class="right" style="margin-top:10px">
            <div class="slide">
			    <img src="<%= Url.Content("~/Content/repository/" + "1.jpg") %>" alt="pic"/>
                <div class="img-frame"></div>
		    </div>
        </div>
        <div style="clear:both"></div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MetaDescription" runat="server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="MetaAuthor" runat="server">
</asp:Content>

<asp:Content ID="Content5" ContentPlaceHolderID="CssContent" runat="server">
    <link type="text/css" rel="Stylesheet" href="<%= Url.Content("~/Content/slides.css") %>" />
</asp:Content>

<asp:Content ID="Content6" ContentPlaceHolderID="ScriptsContent" runat="server">
</asp:Content>
