using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace AzulBodas.Web.Helpers
{
    public static class ImageHelper
    {
        public static void Resize(String inputPath, int width, int height, String outputPath)
        {
            using (FileStream result = new FileStream(outputPath, FileMode.Create, FileAccess.Write))
            {
                using (Image image = Image.FromFile(inputPath))
                {
                    using (Image thumbnail = new Bitmap(width, height))
                    {
                        using (Graphics graphics = Graphics.FromImage(thumbnail))
                        {
                            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                            graphics.SmoothingMode = SmoothingMode.HighQuality;
                            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                            graphics.CompositingQuality = CompositingQuality.HighQuality;

                            graphics.DrawImage(image, 0, 0, width, height);

                            ImageCodecInfo[] info = ImageCodecInfo.GetImageEncoders();
                            EncoderParameters encoderParameters;
                            encoderParameters = new EncoderParameters(1);
                            encoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, 100L);

                            thumbnail.Save(result, info[1], encoderParameters);
                        }
                    }
                }
            }
        }
    }
}