<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<AzulBodas.Web.Models.GalleryModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Imagenes
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <div class="left" style="width:200px;height:435px">
            <div id="submenu">
                <% Html.RenderPartial("SubMenuNavigation", "imagenes"); %>
                <div style="clear:both"></div>
            </div>
            <div  id="thumb">
                <% foreach (String img in Model.Images){%>

			    <a href="#">
                    <div class="slide" style="float:left">
                        <img src="<%= Html.ThumbUrl(img) %>" alt="pic" style="margin-left:3px;margin-top:3px;"/>
                        <div class="img-frame-thumb"></div>
                     </div>
                </a>
                
                <%} %>
            </div>
        </div>
        <div class="right" style="margin-top:10px">
            <div class="slide">
			    <img  id="viewer" src="<%= Url.Content("~/Content/repository/" + "gallery-1.jpg") %>" alt="pic"  width="605px" height="426px"/>
                <div class="img-frame-images"></div>
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
<script type="text/javascript">

    $(function () {
        $("#thumb a").bind("click", function (e) {
            e.preventDefault();
            var content = $(this).find('img');
            var fullpath = content.attr('src');
            var arraypath = fullpath.split('/');
            var filename = arraypath[arraypath.length - 1];

            var viewer = $("#viewer");
            var fullpath = viewer.attr('src');
            var arraypath = fullpath.split('/');
            var numbercharacters = arraypath[arraypath.length - 1].length;
                    
            var text = fullpath.substring(0, fullpath.length - numbercharacters);
            fullpath = text + filename;
            viewer.attr('src',fullpath);

        });
    });
 </script>

</asp:Content>
