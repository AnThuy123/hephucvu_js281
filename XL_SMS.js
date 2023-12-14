const twilio = require('twilio');
class XL_Goi_tin_nhan{
    Goi_Tin_nhan(so_dien_thoai,noi_dung){
        let accountSid = 'AC3c428caa4a12b3aa67074bc03a8ede64'; // Your Account SID from www.twilio.com
        let authToken = '2ad41958c0e8962d17e479d9d8063739';   // Your Auth Token from www.twilio.com
        let client = new twilio(accountSid, authToken);
        return client.messages.create({
            body: noi_dung,
            to: so_dien_thoai,   
            from: '+14754738675' // Số điện thoại dịch vụ cung cấp 
        })
    }
}
var Goi_Tin_nhan=new XL_Goi_tin_nhan()
module.exports= Goi_Tin_nhan