using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AzulBodas.Web.Helpers;

namespace AzulBodas.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "ChangeCulture",
                "Home/ChangeCulture/{lang}",
                new { controller = "Home", action = "ChangeCulture" }
            ).RouteHandler = new SingleCultureMvcRouteHandler();

            routes.MapRoute(
                "Admin",
                "Admin/{action}/{id}",
                new { controller = "Admin", action = "Index", id = UrlParameter.Optional }
            ).RouteHandler = new SingleCultureMvcRouteHandler();

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Languages", id = UrlParameter.Optional } // Parameter defaults
            );

            SetLocalization(routes);
        }

        private static void SetLocalization(RouteCollection routes)
        {
            foreach (Route r in routes)
            {
                if (!(r.RouteHandler is SingleCultureMvcRouteHandler))
                {
                    r.RouteHandler = new MultiCultureMvcRouteHandler();
                    r.Url = "{culture}/" + r.Url;
                    //Adding default culture 
                    if (r.Defaults == null)
                        r.Defaults = new RouteValueDictionary();
                    r.Defaults.Add("culture", Culture.es.ToString());

                    //Adding constraint for culture param
                    if (r.Constraints == null)
                        r.Constraints = new RouteValueDictionary();

                    r.Constraints.Add("culture", new CultureConstraint(Culture.en.ToString(), Culture.es.ToString()));
                }
            }
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterRoutes(RouteTable.Routes);
        }
    }
}