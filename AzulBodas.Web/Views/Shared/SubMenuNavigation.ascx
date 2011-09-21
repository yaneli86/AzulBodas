<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<String>" %>
<ul class="<%= Model %>" style="margin-left:0px">
    <li class="first" >
         <a href='<%= Url.Action("Imagenes", "Home") %>' class="sprite-fotos">Fotos</a>
    </li>
    <li style=" margin-left:7px">
        <a href='<%= Url.Action("Videos", "Home") %>' class="sprite-videos">Videos</a>
    </li>

</ul>