<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<AzulBodas.Web.Models.ScrollablePanelModel>" %>
<p><a href="#" id="scrollUp" class="scroll-arrows sprite-up invisible">Scroll Up</a></p>
<div style="height:<%= Model.Height %>px;overflow:hidden">         
    <div id="page-content">
        <%= Model.Text %>
    </div>
</div>
<p><a href="#" id="scrollDown" class="scroll-arrows sprite-down invisible">Scroll Down</a></p>