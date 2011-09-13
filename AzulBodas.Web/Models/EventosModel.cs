using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class EventosModel: PageModel
    {
        public List<String> Images {get; set;}
        public String MainText { get; set; }

        public EventosModel()
        {
            Images = new List<string>();
        }
    }
}