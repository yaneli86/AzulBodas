using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AzulBodas.Data.Repositories;
using AzulBodas.Data.Model;
using AzulBodas.Web.Helpers;

namespace AzulBodas.Web.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //This is a change
            TextRepository repository = new TextRepository();
            Text text =  repository.GetTextById(1);
            return View(text);
        }

        public ActionResult IslaHolBox()
        {
            return View();
        }

        public ActionResult Languages()
        {
            return View();
        }

        public ActionResult ChangeCulture(Culture lang, string returnUrl)
        {
            if (returnUrl.Length >= 3)
            {
                returnUrl = returnUrl.Substring(3);
            }
            else if (returnUrl == "/")
            {
                return RedirectToAction("Index", new { culture = lang.ToString() });
            }
            return Redirect("/" + lang.ToString() + returnUrl);
        }
    }
}
