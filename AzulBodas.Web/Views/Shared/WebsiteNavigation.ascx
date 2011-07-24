<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<String>" %>
<ul class="<%= Model %>">
    <li class="first">
        <a href='<%= Url.Action("Index", "Home") %>' class="sprite-home">Home</a>
    </li>
    <li>
        <a href='<%= Url.Action("AzulBodas", "Home") %>' class="sprite-azulbodas">Azul Bodas</a>
    </li>
    <li>
        <a href='<%= Url.Action("IslaHolBox", "Home") %>' class="sprite-islaholbox">Isla Holbox</a>
    </li>
    <li>
        <a href='<%= Url.Action("Imagenes", "Home") %>' class="sprite-imagenes">Im&aacute;agenes</a>
    </li>
    <li>
        <a href='<%= Url.Action("Eventos", "Home") %>' class="sprite-eventos">Eventos</a>
    </li>
    <li>
        <a href='<%= Url.Action("Bodas", "Home") %>' class="sprite-bodas">Bodas</a>
    </li>
    <li>
        <a href='<%= Url.Action("Contacto", "Home") %>' class="sprite-contacto">Contacto</a>
    </li>
</ul>