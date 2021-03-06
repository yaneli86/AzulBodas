﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<AzulBodas.Web.Models.ContactoModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Contacto
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
 <div style="margin-top:60px; margin-bottom:100px;">
        <div style="margin: 0 auto; width:245px;">
            <div style="margin-right:25px; float:left;">
                <div>
                    <% AzulBodas.Web.Models.Partner partner1 = Model.Partners.ElementAt(0); %>
                    <img src='<%= Url.Content("~/Content/repository/" + partner1.Photo) %>'  alt=""/>
                </div>
                <div class="contact-name" >
                    <%= partner1.Name %>
                </div>
                 <div class="contact-position">
                    <%= partner1.Position %>
                </div>
            </div>
             <div>
               <div>
                    <% AzulBodas.Web.Models.Partner partner2 = Model.Partners.ElementAt(1); %>
                    <img src='<%= Url.Content("~/Content/repository/" + partner2.Photo) %>'  alt=""/>
                </div>
                <div class="contact-name">
                    <%= partner2.Name %>
                </div>
                 <div class="contact-position">
                    <%= partner2.Position %>
                </div>
            </div>
        </div>
        <div style="margin: 0 auto; width:500px;">
            <div style="margin-left:130px">
                <div style="margin-top:45px">
                <div style="float:left; margin-right:23px; height: 50px; width: 85px;">
                    <p class="contact-title">
                    Télefonos:
                    </p>
                </div>
                <div >
                    <p class="contact-standard">
                     <%: Model.PhoneNumber[0]%>
                    </p>
                    <p class="contact-standard">
                     <%: Model.PhoneNumber[1]%>
                    </p>
                </div>
            </div>
           <div style="margin-top:35px">
                <div style="float:left; margin-right:23px; height: 30px; width: 85px;">
                    <p class="contact-title">
                    email:
                    </p>
                </div>
                <div>
                    <p class="contact-standard">
                     <%: Model.Email%>
                    </p>
                </div>
           </div> 
          </div>
        </div>
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
