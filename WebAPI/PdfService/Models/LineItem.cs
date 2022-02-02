using System;
using System.Collections.Generic;
using System.Text;

namespace PdfService.Models
{
    public class LineItem
    {
        public string ItemId { get; set; }
        public string ItemName { get; set; }
        public string Qty { get; set; }
        public string ItemPrice { get; set; }
        public string LineItemPrice { get; set; }
    }
}
