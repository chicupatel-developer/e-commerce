using System;
using System.Collections.Generic;
using System.Text;

namespace PdfService.Models
{
    public class ShoppingData
    {
        public ShopperInfo ShopperInfo { get; set; }
        public ShippingData ShippingData { get; set; }
        public List<LineItem> LineItems { get; set; }
        public PaymentData PaymentData { get; set; }
        public string GrandTotal { get; set; }
    }
}
