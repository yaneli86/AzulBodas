using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class ScrollablePanelModel
    {
        public int Height { get; set; }
        public String Text { get; set; }

        public ScrollablePanelModel() 
        {
            Height = 385;
        }
    }
}