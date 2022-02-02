using PdfService.Models;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Text;

namespace PdfService
{
    public class CommerceJsShopping : ICommerceJsShopping
    {
        public HtmlToPdf GetHtmlToPdfObject()
        {
            HtmlToPdf converter = new HtmlToPdf();

            // header settings
            converter.Options.DisplayHeader = true;
            converter.Header.DisplayOnFirstPage = true;
            converter.Header.DisplayOnOddPages = true;
            converter.Header.DisplayOnEvenPages = true;
            converter.Header.Height = 50;

            // footer settings
            converter.Options.DisplayFooter = true;
            converter.Footer.DisplayOnFirstPage = true;
            converter.Footer.DisplayOnOddPages = true;
            converter.Footer.DisplayOnEvenPages = true;
            converter.Footer.Height = 75;

            // left and right side margin
            converter.Options.MarginLeft = 50;
            converter.Options.MarginRight = 50;

            // set converter options
            converter.Options.PdfPageSize = PdfPageSize.A4;
            converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            converter.Options.WebPageWidth = 1000;
            converter.Options.WebPageHeight = 1414;

            return converter;
        }


        public string GetPageHeader()
        {
            string pageHeader = @"<html>
                                 <head> 
                                    <style>
                                        body {
                                            font-size: xx-large;
                                        }
                                       
                                        .headerDiv{
                                            text-align: center;
                                            vertical-align: middle; 
                                            margin-top: 70px;
                                            margin-bottom: 30px;
                                            color: blue;
                                        }
                                        .shopperInfoDiv{                                          
                                            margin-top: 30px;
                                            margin-bottom: 30px;
                                        }
                                        .shoppingHeader{
                                            color: green;
                                            margin-bottom: -20px;
                                            padding-bottom: -20px;
                                        }
                                        .shippingDiv{                                          
                                            margin-top: 30px;
                                            margin-bottom: 30px;
                                        }
                                        .shippingHeader{
                                            color: green;
                                            margin-bottom: -20px;
                                            padding-bottom: -20px;
                                        }
                                        .paymentDiv{                                          
                                            margin-top: 30px;
                                            margin-bottom: 30px;
                                        }
                                        .paymentHeader{
                                            color: green;
                                            margin-bottom: -20px;
                                            padding-bottom: -20px;
                                        }
                                        .lineItemDiv{                                          
                                            margin-top: 30px;
                                            margin-bottom: 30px;
                                        }
                                        .lineItemHeader{
                                            color: green;
                                            margin-bottom: -30px;
                                            padding-bottom: -30px;
                                        }
                                    </style>
                                 </head>
                             <body>
                                <div class='headerDiv'>
                                    <h2>Order Confirmation</h2>
                                </div>";
            return pageHeader;
        }

        public string GetPageFooter()
        {
            string pageFooter = @"   </body>
                                   </html>
                                ";
            return pageFooter;

        }

        public string GetShopperInfoString(ShopperInfo shopperInfo)
        {
            string shopperInfoString = null;

            shopperInfoString = @"
                                <div class='shopperInfoDiv'>
                                    <div class='shoppingHeader'>
                                        <h3>Customer</h3>
                                    </div>
                                    <div>" +
                                        "<div><b>" +
                                            shopperInfo.FirstName + "&nbsp;" + shopperInfo.LastName +
                                        "</b><br />" + shopperInfo.Email +
                                    @"</div></div>  
                                </div>
                                <hr />
                            ";

            return shopperInfoString;
        }

        public string GetShippingString(ShippingData shippingData)
        {
            string shippingString = null;

            shippingString = @"
                                <div class='shippingDiv'>
                                    <div class='shippingHeader'>
                                        <h3>Shipping</h3>
                                    </div>
                                    <div>" +
                                        "<div>Shipping Method: " +
                                            shippingData.ShippingMethod +
                                        "<br />Shipping Type: " + shippingData.ShippingType +
                                        "<br />Country: " + shippingData.Country +
                                        "<br />State: " + shippingData.State +
                                        "<br />City: " + shippingData.City +
                                        "<br />Street: " + shippingData.Street +
                                        "<br />Postal / Zip Code: " + shippingData.PostalZipCode +
                                    @"</div></div>  
                                </div>
                                <hr />
                            ";

            return shippingString;
        }


        public string GetPaymentString(PaymentData paymentData)
        {
            string paymentString = null;

            paymentString = @"
                                <div class='paymentDiv'>
                                    <div class='paymentHeader'>
                                        <h3>Payment</h3>
                                    </div>
                                    <div>" +
                                        "<div>Gateway: " +
                                            paymentData.Gateway +
                                        "<br />Payment Method: " + paymentData.PaymentMethodId +                                       
                                    @"</div></div>  
                                </div>
                                <hr />
                            ";

            return paymentString;
        }

        public string GetLineItemString(List<LineItem> lineItems, string grandTotal)
        {
            StringBuilder lineItemString = new StringBuilder();

            lineItemString.Append(@"<div class='lineItemDiv'> 
                                        <div class='lineItemHeader'>
                                            <h3>Purchased Item(s) <br />Grand Total : " + grandTotal + @"</h3>                                            
                                        </div><ul>"
                                );

            foreach (var lineItem in lineItems)
            {
                lineItemString.Append(@"<li >");
                lineItemString.Append(@"<div><b>" + lineItem.ItemName + "</b></div>");
                lineItemString.Append(@"<div >");
                lineItemString.Append(@"[" + lineItem.ItemPrice + " * " + lineItem.Qty + "] = " + lineItem.LineItemPrice + "</div>");
                lineItemString.Append(@"</li>");
            }

            lineItemString.Append("</ul></div><hr />");

            return lineItemString.ToString();
        }
    }
}
