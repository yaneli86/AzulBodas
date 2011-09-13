using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class HomeModel : PageModel
    {
        public List<String> Images { get; set; }

        public HomeModel()
        {
            Images = new List<String>();
        }
    }
}