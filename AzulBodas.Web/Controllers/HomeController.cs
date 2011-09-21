using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AzulBodas.Data.Repositories;
using AzulBodas.Data.Model;
using AzulBodas.Web.Helpers;
using AzulBodas.Web.Models;

namespace AzulBodas.Web.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            HomeModel model = new HomeModel
            {
                Title = "Home - Azul Bodas",
                Keywords = "",
                Description = "",
                Images = new List<string> { "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg"}
            };
            return View(model);
        }

        public ActionResult AzulBodas()
        {
            AzulBodasModel model = new AzulBodasModel
            {
                Title = "Azul Bodas",
                MainText = "<p style='text-align:justify;margin-bottom:10px'>Somos una empresa dedicada a organizar bodas y eventos en el lugar que siempre ha imaginado como perfecto. Nuestro principal objetivo es darle la comodidad y confianza de dejar en nuestras manos la planeación de los eventos más importantes en sus vidas, así como la libertad que necesita para que la planeación de estos no tenga que ser una carga para nuestros clientes.</p><p style='text-align:justify;margin-bottom:10px'>Aligerando el peso que implica la organización de una fiesta y enfocándolo en los detalles más importantes para usted, en Azul Bodas nos encargamos de cubrir sus expectativas y hacer de su evento una realidad que ha dejado de ser sueño.</p><p style='text-align:justify'>Nuestra intención es ser el vínculo que usted necesita entre el contacto directo con la naturaleza y el evento que quiera realizar, brindándole la atención y el servicio que sabemos esta ocasión tan especial merece.</p>",
                Keywords = "",
                Description = "",
                //Images = new List<string> { "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg", "square_pic.jpg", "square_pic2.jpg" }
                Images = new List<string> { "1.jpg", "2.jpg", "3.jpg", "4.jpg" }
            };
            return View(model);
        }

        public ActionResult IslaHolBox()
        {
            IslaHolboxModel model = new  IslaHolboxModel
            {
                Title = "Isla Holbox",
                MainText = "<p style='text-align:justify;margin-bottom:10px'>Holbox, cuyo significado en maya es “hoyo negro”, se ilumina incluso en la noche más oscura por el brillo de las estrellas, encanta con atardeceres de ensueño y es sin duda el lugar ideal para un evento como el que usted pretende realizar.</p><p style='text-align:justify;margin-bottom:10px'>Es una pequeña isla de pescadores que con el paso de los años aún no ha perdido el encanto rústico, de serenidad y calidez característica del Caribe mexicano. Es uno de los pocos paraísos no explotados que persisten en el sureste de nuestro país donde se funde el cálido mar con las más blancas costas de arena suave…</p><p style='text-align:justify;margin-bottom:10px'>Algunos datos importantes de la isla:</p><p style='text-align:justify;margin-bottom:10px'>Únicamente hay un cajero automático para toda la isla, recomendamos estar preparados con suficiente efectivo ya que la mayoría de los establecimientos en Holbox no aceptan tarjetas de crédito.</p><p style='text-align:justify;margin-bottom:10px'>No hay bancos en la isla.</p><p style='text-align:justify;margin-bottom:10px'>Debido a que Isla Holbox sigue siendo un lugar relativamente virgen, hay mosquitos e insectos porque estamos rodeados de una maravillosa vegetación, por lo que sugerimos empacar repelente.</p><p style='text-align:justify;margin-bottom:10px'>No hay automóviles, solamente carritos de golf, motos y bicis que están disponibles para renta en establecimientos y hoteles.</p><p style='text-align:justify;margin-bottom:10px'>Holbox está a una hora y media de Cancún por carretera y a 3 horas y media de Mérida.</p><p style='text-align:justify;margin-bottom:10px'>Holbox es un lugar para dejar los zapatos y conectarse con la tierra en cada paso sobre sus rústicas calles de arena…</p>",
                Keywords = "",
                Description = "",
                Images = new List<string> { "1.jpg", "2.jpg", "3.jpg", "4.jpg" }
            };
            return View(model);
        }

        public ActionResult Imagenes()
        {
            GalleryModel model = new GalleryModel
            {
                Title = "Galería de Imágenes",
                Keywords = "",
                Description = "",
                Images = new List<string> { "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "gallery-4.jpg", "gallery-5.jpg" }
            };
            return View(model);
        }

        public ActionResult Eventos()
        {
            EventosModel model = new EventosModel
            {
                Title = "Eventos",
                MainText = "<p style='text-align:justify;margin-bottom:10px'>En Azul Bodas no solo nos enfocamos a las bodas, si no que tenemos una amplia gama de proveedores y junto con ellos nos adecuamos a las necesidades de cualquier tipo de evento desde bautizos hasta fiestas de cumpleaños, únicamente teniendo en común el escenario perfecto del mar Caribe y arena blanca.</p><p style='text-align:justify;margin-bottom:10px'>Tenemos la capacidad, dependiendo del lugar en el que se realice de hacer eventos desde 10 hasta más de 200 invitados.</p><p style='text-align:justify;margin-bottom:10px'>FIESTAS<br/>QUINCE AÑOS<br/>BAUTIZOS<br/>CUMPLEAÑOS<br/>ANIVERSARIOS</p>",
                Keywords = "",
                Description = "",
                Images = new List<string> { "1.jpg", "2.jpg", "3.jpg", "4.jpg" }
            };
            return View(model);
        }

        public ActionResult Bodas()
        {
            BodasModel model = new BodasModel
            {
                Title = "Bodas",
                MainText = "<p style='text-align:justify;margin-bottom:10px'>Azul Bodas es el único paso a seguir para la organización de su boda. Nuestra tarea es hacer que ese día se convierta en el que todas soñamos. Holbox se encarga de proveer el escenario paradisíaco y nosotros de todos los detalles del evento para que el resultado sea  perfecto e inolvidable,</p><p style='text-align:justify;margin-bottom:10px'>Holbox es una isla que se encuentra en el extremo norte de Quintana Roo, sin grandes ciudades alrededor, sin embargo, contamos con proveedores que, junto con nosotros, harán un éxito de cualquier evento con moderno mobiliario y decoración, animación, música y todos los detalles necesarios para el gran día.</p><p style='text-align:justify;margin-bottom:10px;color:#1d9fc1;'>¡Sería un honor para nosotros ser parte de ésta fecha tan especial!</p>",
                Keywords = "",
                Description = "",
                Images = new List<string> { "1.jpg", "2.jpg", "3.jpg", "4.jpg" }
            };
            return View(model);
        }

        public ActionResult Contacto()
        {
            ContactoModel model = new ContactoModel
            {
                Title = "Contacto",
                Keywords = "",
                Description = "",
                PhoneNumber = new List<string> {"+52 984 804 56 53", "+52 984 875 20 17"},
                Email = "azulbodasholbox@hotmail.com",
                Partners = new List<Partner> { new Partner { Name = "Cecilia Rayo", Photo = "cecilia.png", Position = "Organizadora" }, new Partner { Name = "Presi Molino", Photo = "preci.png", Position = "Socia" } },
            };

            return View(model);
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
