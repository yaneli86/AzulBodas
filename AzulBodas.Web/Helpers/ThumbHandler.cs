using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.IO;
using System.Drawing;

namespace AzulBodas.Web.Helpers
{
    public class ThumbHandler : IHttpHandler
    {
        #region IHttpHandler Members

        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var routeData = context.Request.RequestContext.RouteData;
            String file = String.Concat(routeData.Values["file"].ToString(), ".", routeData.Values["ext"].ToString());
            String repositoryPath = context.Request.MapPath("~/Content/repository");
            String imgpath = Path.Combine(repositoryPath, file);
            String thumbpath = Path.Combine(context.Request.MapPath("~/Content/thumbs"), file);

            if (File.Exists(imgpath) && !File.Exists(thumbpath))
            {
                ImageHelper.Resize(imgpath, 45, 45, thumbpath);
            }
            context.Response.ContentType = "image/jpeg";
            context.Response.TransmitFile(thumbpath);
        }

        #endregion
    }

    public class ThumbRouteHandler : IRouteHandler
    {

        #region IRouteHandler Members

        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return new ThumbHandler();
        }

        #endregion
    }
}