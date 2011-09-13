using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class SlidesModel
    {
        public IEnumerable<String> Images { get; set; }
        public String FrameCssClass { get; set; }
        public int Width { get; set; }
    }
}