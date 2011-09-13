<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<AzulBodas.Web.Models.SlidesModel>" %>
<div id="slides" style="width:<%= Model.Width %>px;display:none">
	<div class="slides_container">
        <% foreach(String filename in Model.Images){ %>
        <div class="slide">
			<img src="<%= Url.Content("~/Content/repository/" + filename) %>" alt="pic"/>
            <div class="<%= Model.FrameCssClass %>"></div>
		</div>
        <% }%> 
    </div>
    <style type="text/css">
        #slides .pagination{width:<%= 13 * Model.Images.Count() %>px}
    </style>
</div>