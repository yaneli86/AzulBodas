using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class IslaHolboxModel: PageModel
    {
        public List<String> Images { get; set; }
        public String MainText { get; set; }

        public IslaHolboxModel()
        {
            Images = new List<String>();
        }

    }
}