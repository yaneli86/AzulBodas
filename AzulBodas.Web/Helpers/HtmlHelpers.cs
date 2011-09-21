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
    }

}