using System;
using System.Collections.Generic;
using System.Text;

namespace PdfService.Models
{
    public class ShippingData
    {
        public string ShippingMethod { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string ShippingType { get; set; }
        public string PostalZipCode { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
    }
}
