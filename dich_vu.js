
const http = require("http")
// Khai báo cổng cho dịch vụ
const fs = require("fs");
const port = 5500;
//Tham chiếu queryString của node js 
const querystring = require('querystring');
//Tham chiếu đến thư viện url của node js
const URI = require("url");
// Tham chiếu đến thư viện MongoDB
const db = require("./mongoDB");
//tham chiếu đến thư viện send mail
const sendMail = require("./sendMail");

//Tham chiếu thư viện sms
const sms = require("./XL_SMS")

const dich_vu = http.createServer((req, res) => {
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*');
    // Method
    let method = req.method;
    // url
    let url = req.url;
   
    
    let ket_qua = `Server Node JS - Method: ${method} - Url: ${url}`;

    if (method == "GET") {
        let param={}
        param = URI.parse(url, true);
        url=param.pathname;
        let query=param.query
        if (url == "/dsTivi") {
            if(Object.keys(query).length==0) {
                db.getAll("tivi").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            } else {
                console.log(param.query.Ma_so);
                let filter = {
                    "Ma_so" : param.query.Ma_so
                }
                console.log(filter);
                db.getOne("tivi",filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } 
        else if (url == "/dsMathang") {
            if(!query.Ma_so) {
                db.getAll("food").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("food", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        }
        else if (url == "/dsDienthoai") {
            if(!query.Ma_so) {
                db.getAll("mobile").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("mobile", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } else if (url == "/Cuahang") {
            if(!query.Ma_so) {
                db.getAll("store").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("store", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } else if (url == "/dsHocsinh") {
            if(!query.Ma_so) {
                db.getAll("student").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("student", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } else if (url.match("\.png$")) {
            let imagePath = `images/${url}`;
            if (!fs.existsSync(imagePath)) {
                imagePath = `images/noImage.png`;
            }
            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/png" });
            fileStream.pipe(res);

        } else {
            ket_qua = `Method: ${method} - Url: ${url} - Error`;
            res.end(ket_qua);
        }

    } else if (method == "POST") {
        // Nhận Tham số từ Client gởi về
        let noi_dung_nhan = '';
        req.on("data",(data)=>{
            noi_dung_nhan+= data
            
        })
        // Xử lý Tham số, trả kết quả về cho client
        if(url=="/ThemNguoidung"){
            req.on("end",()=>{
               db.insertOne("user",JSON.parse(noi_dung_nhan)).then((result) => {
                ket_qua = JSON.stringify(result);
                res.end(ket_qua)
               }).catch(err => console.log(err));
            })
        }else if(url=="/SuaNguoidung"){
            req.on("end",()=>{
                
                let nguoiDung=JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so" : nguoiDung.Ma_so
                }
                let userUpdate = {
                    $set: {
                        "Ho_ten": nguoiDung.Ho_ten,
                        "Ten_Dang_nhap": nguoiDung.Ten_Dang_nhap,
                        "Mat_khau": nguoiDung.Mat_khau
                    }
                }
                db.updateOne("user",filter,userUpdate).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));

            })
        }else if(url=="/XoaNguoidung"){
            req.on("end",()=>{
                let nguoiDung=JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so" : nguoiDung.Ma_so
                }
                db.deleteOne("user",filter).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err)); 
            })
        } else if (url == "/SMS") {
            req.on("end", () => {
                let ket_qua = { "Noi_dung": true };
                let so_dien_thoai = `+84708375980`
                let noi_dung = `Test SMS From Service javaScript`
                sms.Goi_Tin_nhan(so_dien_thoai, noi_dung).then(result => {
                    console.log(result)
                    res.end(JSON.stringify(ket_qua))
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.end(JSON.stringify(ket_qua));
                })
            })
        }else if(url=="/Dangnhap"){
            req.on("end",()=>{
                
                let ket_qua = {
                    "Noi_dung": true
                }
                let user=JSON.parse(noi_dung_nhan);
                let dieukien = {
                    $and: [
                        { "Ten_Dang_nhap": user.Ten_Dang_nhap },
                        { "Mat_khau": user.Mat_khau }
                    ]
                }
                db.getOne("user",dieukien).then(result=>{
                    console.log(result)
                    ket_qua.Noi_dung = {
                        "Ho_ten": result.Ho_ten,
                        "Nhom": {
                            "Ma_so": result.Nhom_Nguoi_dung.Ma_so,
                            "Ten": result.Nhom_Nguoi_dung.Ten
                        }
                    };
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));

                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung=false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })	
            })
        }else if (url == "/Lienhe") {
            req.on("end", function () {
                let thongTin = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                let from = `ltv.javascript@gmail.com`;
                let to = thongTin.email;
                let subject = thongTin.tieude;
                let body = thongTin.noidung
                sendMail.Goi_Thu_Lien_he(from, to, subject, body).then(result => {
                    console.log(result)
                    res.end(JSON.stringify(Ket_qua));
                }).catch(err => {
                    console.log(err);
                    Ket_qua.Noi_dung = false;
                    res.end(JSON.stringify(Ket_qua));
                })
            })
        } else if (url == "/Dathang") {
            req.on("end", () => {
                let dsDathang = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": [] };
                dsDathang.forEach(item => {
                    let filter = {
                        "Ma_so": item.key
                    }
                    let collectionName = (item.manhom == 1) ? "tivi" : (item.manhom == 2) ? "food" : "mobile";
                    db.getOne(collectionName, filter).then(result => {
                        item.dathang.So_Phieu_Dat = result.Danh_sach_Phieu_Dat.length + 1;
                        result.Danh_sach_Phieu_Dat.push(item.dathang);
                        // Update
                        let capnhat = {
                            $set: { Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat }
                        }
                        let obj = {
                            "Ma_so": result.Ma_so,
                            "Update": true
                        }
                        db.updateOne(collectionName, filter, capnhat).then(result => {
                            if (result.modifiedCount == 0) {
                                obj.Update = false
                            }
                            ket_qua.Noi_dung.push(obj);
                            console.log(ket_qua.Noi_dung)
                            if (ket_qua.Noi_dung.length == dsDathang.length) {
                                res.end(JSON.stringify(ket_qua));
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }).catch(err => {
                        console.log(err);
                    })

                })
            })
        } else if (url == "/ThemDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("mobile", mobile).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        }
        else if (url == "/SuaDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("mobile",mobile.condition,mobile.update).then(result=>{
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua)) 
                })
            })
        }
        else if (url == "/XoaDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("mobile",mobile).then(result=>{
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    let m = "Hello";
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
                
            })

        }
        //Thêm hình ảnh
        else if (url == "/ImagesDienthoai") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------
                
                let kq = saveMedia(img.name, img.src)
                if (kq == "OK") {
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }else{
                    Ket_qua.Noi_dung=false
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }

                // upload img host cloudinary ------------------------------
                
                imgCloud.UPLOAD_CLOUDINARY(img.name,img.src).then(result=>{
                    console.log(result);
                    res.end(JSON.stringify(Ket_qua));

                }).catch(err=>{
                    Ket_qua.Noi_dung=false
                    res.end(JSON.stringify(Ket_qua))
                })
                
            })

        }



    } else {
        res.end(ket_qua);
    }
})


function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Error ...');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function saveMedia(Ten, Chuoi_nhi_phan) {
    var Kq = "OK"
    try {
        var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
        var Duong_dan = "images//" + Ten
        fs.writeFileSync(Duong_dan, Nhi_phan.data);
    } catch (Loi) {
        Kq = Loi.toString()
    }
    return Kq
}

dich_vu.listen(port, () => {
    console.log(`Server http://localhost:${port} run ....`)
})