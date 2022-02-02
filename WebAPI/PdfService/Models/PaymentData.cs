using System;
using System.Collections.Generic;
using System.Text;

namespace PdfService.Models
{
    public class PaymentData
    {
        public string Gateway { get; set; }
        public string PaymentMethodId { get; set; }
    }
}
