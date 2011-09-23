using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
namespace AzulBodas.Web.Helpers
{
    public static class HtmlHelpers
    {
        public static HtmlString ThumbUrl(this HtmlHelper helper, string filename)
        {
            UrlHelper urlHelper = new UrlHelper(helper.ViewContext.RequestContext);
            return new HtmlString(urlHelper.Content("~/Thumb/" + filename));
        }

        public static MvcHtmlString ChangeLanguage(this HtmlHelper helper)
        {
            var objCulture = helper.ViewContext.RequestContext.RouteData.Values["culture"];
            MvcHtmlString link = MvcHtmlString.Create(String.Empty);
            if (objCulture != null)
            {
                Culture currCulture = (Culture)Enum.Parse(typeof(Culture), objCulture.ToString(), true);
                String cssClass = currCulture == Culture.en ? "sprite-espanol" : "sprite-english";
                Culture otherCulture = currCulture == Culture.en ? Culture.es : Culture.en;

                link = helper.ActionLink(" ", "ChangeCulture", "Home", new { lang = otherCulture.ToString(), returnUrl = helper.ViewContext.HttpContext.Request.RawUrl }, new { @class = "lang " + cssClass });
            }
            return link;
        }
    }

}