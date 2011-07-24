using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AzulBodas.Web.Helpers
{
    public class AzulBodasMasterPage : ViewMasterPage
    {
        public String ActivePage 
        { 
            get 
            { 
                return Request.RequestContext.RouteData.Values["action"].ToString().ToLower(); 
            } 
        }

        public AzulBodasMasterPage() 
        {

        }
    }
}