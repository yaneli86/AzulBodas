using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AzulBodas.Web.Models
{
    public class ContactoModel: PageModel
    {
        public String Email { get; set; }
        public List<String> PhoneNumber { get; set;}
        public List<Partner> Partners { get; set; }

        public ContactoModel()
        {
            PhoneNumber = new List<String>();
            Partners = new List<Partner>();
        }
    }
}