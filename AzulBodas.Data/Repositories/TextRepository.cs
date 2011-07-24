using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AzulBodas.Data.Model;
namespace AzulBodas.Data.Repositories
{
    public interface ITextRepository
    {
        Text GetTextById(int id);
        void AddText(Text text);
        //void UpdateText(Text text);
        //void DeleteText(Text text);
    }

    public class TextRepository : ITextRepository
    {
       
        public Text  GetTextById(int id)
        {
            using (AzulBodasEntities ctx = new AzulBodasEntities())
            {
                return ctx.Texts.FirstOrDefault(n => n.Id == id);
            }
        }

        public void  AddText(Text text)
        {
            using (AzulBodasEntities ctx = new AzulBodasEntities())
            {
                ctx.Texts.AddObject(text);
                ctx.SaveChanges();
            }
        }
    }
}
