using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using PdfService.Models;
using SelectPdf;


namespace PdfService
{
    public interface ICommerceJsShopping
    {
        HtmlToPdf GetHtmlToPdfObject();
        string GetPageHeader();
        string GetPageFooter();
        string GetShopperInfoString(ShopperInfo shopperInfo);
        string GetShippingString(ShippingData shippingData);
        string GetPaymentString(PaymentData paymentData);
        string GetLineItemString(List<LineItem> lineItems, string grandTotal);
    }
}
