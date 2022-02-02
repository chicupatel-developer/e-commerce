using APICommerceJs.DTO;
using PdfService;
using PdfService.Models;
using EmailService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APICommerceJs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommerceJsController : ControllerBase
    {
        private APIResponse _response;

        private readonly ICommerceJsShopping _commerceJs;
        private readonly IEmailSender _emailSender;

        public CommerceJsController(ICommerceJsShopping commerceJs, IEmailSender emailSender)
        {
            _commerceJs = commerceJs;
            _emailSender = emailSender;
        }



        // create pdf resume as byte[] and display @ browser
        [HttpPost]
        [Route("shoppingConfirmation")]
        public IActionResult ShoppingConfirmation(ShoppingData myShopping)
        {
            _response = new APIResponse();

            try
            {
                // throw new Exception();

                // instantiate a html to pdf converter object
                HtmlToPdf converter = _commerceJs.GetHtmlToPdfObject();

                // prepare data
                // incoming from react
                // Shopper Info
                ShopperInfo shopperInfo = new ShopperInfo();
                shopperInfo = myShopping.ShopperInfo;
                if (shopperInfo == null)
                {
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Bad Request!";
                    return StatusCode(400, _response);
                }

                // LineItem
                List<LineItem> lineItems = new List<LineItem>();
                lineItems = myShopping.LineItems;
                if (lineItems == null)
                {
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Bad Request!";
                    return StatusCode(400, _response);
                }

                // Shipping Data
                ShippingData shippingData = new ShippingData();
                shippingData = myShopping.ShippingData;
                if (shippingData == null)
                {
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Bad Request!";
                    return StatusCode(400, _response);
                }

                // Payment Data
                PaymentData paymentData = new PaymentData();
                paymentData = myShopping.PaymentData;
                if (paymentData == null)
                {
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Bad Request!";
                    return StatusCode(400, _response);
                }

                // Grand Total                
                var grandTotal = myShopping.GrandTotal;
                if (grandTotal == null)
                {
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Bad Request!";
                    return StatusCode(400, _response);
                }

                var content = _commerceJs.GetPageHeader() +                                
                                _commerceJs.GetShopperInfoString(shopperInfo) +
                                _commerceJs.GetLineItemString(lineItems, grandTotal) +
                                _commerceJs.GetShippingString(shippingData) +
                                _commerceJs.GetPaymentString(paymentData) +
                                _commerceJs.GetPageFooter();

                // create pdf as byte[] and display @ browser
                var pdf = converter.ConvertHtmlString(content);
                var pdfBytes = pdf.Save();

                // download to user's computer
                return File(pdfBytes, "application/pdf");
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                return StatusCode(500, _response);
            }
        }

    }
}
