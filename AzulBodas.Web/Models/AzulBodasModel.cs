using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class AzulBodasModel : PageModel
    {
        public List<String> Images { get; set; }
        public String MainText { get; set; }

        public AzulBodasModel()
        {
            Images = new List<String>();
        }
    }
}