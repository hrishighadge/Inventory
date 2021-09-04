var nodemailer = require("nodemailer");
const constants = require("./constants");

// AWS.config.update({region: 'REGION'});
const sendEmail = function (buyername, email, orderid, status) {
  let message;
  switch (status) {
    case "Pending":
      message =
        "We are happy to let you know that we have recieved your order & you will get a confirmation mail once the payment is approved.";
      break;
    case "Rejected":
      message = "We regret to inform you that your order has been Rejected.";
      break;
    case "Processed":
      message =
        "Thanks for choosing Us, your order has been successfully processed.";
      break;
    case "Shipped":
      message = "Your order is shipped from Us.";
      break;
    case "En-route":
      message = "Your Order is on your way, It will reach to you shortly.";
      break;
    case "Delivered":
      message = "Your Order has been delivered successfully.";
      break;
  }
  const output = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<style>
@import url("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css")
*{margin:0;padding:0;font-family:"Helvetica Neue",Helvetica,Helvetica,Arial,sans-serif;font-size:100%;line-height:1.6}
img{max-width:100%}
body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100%!important;height:100%}
.btn-primary{text-decoration:none;color:#fff;background-color:#348eda;border:solid #348eda;border-width:10px 20px;line-height:2;font-weight:700;margin-right:10px;text-align:center;cursor:pointer;display:inline-block;border-radius:25px}.btn-secondary{text-decoration:none;color:#fff;background-color:#aaa;border:solid #aaa;border-width:10px 20px;line-height:2;font-weight:700;margin-right:10px;text-align:center;cursor:pointer;display:inline-block;border-radius:25px}.last{margin-bottom:0}.first{margin-top:0}.padding{padding:10px 0}table.body-wrap{width:100%;padding:20px}table.body-wrap .container{border:1px solid #f0f0f0}table.footer-wrap{width:100%;clear:both!important}.footer-wrap .container p{font-size:12px;color:#666}table.footer-wrap a{color:#999}h1,h2,h3{font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;line-height:1.1;margin-bottom:15px;color:#000;margin:40px 0 10px;line-height:1.2;font-weight:200}h1{font-size:36px}h2{font-size:28px}h3{font-size:22px}ol,p,ul{margin-bottom:10px;font-weight:400;font-size:14px}ol li,ul li{margin-left:5px;list-style-position:inside}.container{display:block!important;max-width:600px!important;margin:0 auto!important;clear:both!important}.body-wrap .container{padding:20px}.content{max-width:600px;margin:0 auto;display:block}.content table{width:100%}</style>
</head> 
<body bgcolor="#f6f6f6">
<table class="body-wrap">
	<tr>
		<td></td>
		<td class="container" bgcolor="#FFFFFF">
			<div class="content">
			<table>
      <tr>
        <td></td>
        <td>Dear ${buyername},<br/><br/>
            Order Id: ${orderid}<br/><br/>${message}</td>
        </tr>
        <tr>
        <td></td>
        <td><br/><button class="btn btn-dark btn-primary"><a href="${constants.server_url}order-tracking?id=${orderid}">
        Track your Order</a></button></td>
        </tr>
        <tr>
        <td></td>
        <td><br/>If you have any query, you may call us on +65 63861372, +65 63851375.
        <br/><br/>We are here to help!<br/><br/>Thank You for placing your order!<br/><br/>Best Regards</td>
        </tr>
        <tr>
        <td></td>
        </tr>
        </table>
        </div>
        </td>
        <td></td></tr></table></body></html>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: constants.No_Reply_Email, // generated ethereal user
      pass: constants.No_Reply_Password, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transporter.sendMail(
    {
      from: `Marine Parts ${constants.No_Reply_Email}`, // sender address
      to: email, // list of receivers
      subject: "Track Your Order", // Subject line
      text: "", // plain text body
      html: output, // html body
    },
    (err, info) => {
      if (err) return console.log(err);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  );
};
module.exports = sendEmail;
