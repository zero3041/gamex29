
let tab_NapThe = require('../../Models/NapThe');
let NhaMang    = require('../../Models/NhaMang');
let MenhGia    = require('../../Models/MenhGia');
let UserInfo   = require('../../Models/UserInfo');
let config     = require('../../../config/thecao');
let request    = require('request');
let validator  = require('validator');
let crypto = require('crypto');

module.exports = function(client, data){
	if (!!data && !!data.nhamang && !!data.menhgia && !!data.mathe && !!data.seri && !!data.captcha) {
		if (!validator.isLength(data.captcha, {min: 4, max: 4})) {
			client.red({notice:{title:'LỖI', text:'Captcha không đúng', load: false}});
		}else if(validator.isEmpty(data.nhamang)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng chọn nhà mạng...', load: false}});
		}else if(validator.isEmpty(data.menhgia)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng chọn mệnh giá thẻ...', load: false}});
		}else if(validator.isEmpty(data.mathe)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng nhập mã thẻ cào...', load: false}});
		}else if(validator.isEmpty(data.seri)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng nhập seri ...', load: false}});
		}else{
			let checkCaptcha = new RegExp('^' + data.captcha + '$', 'i');
				checkCaptcha = checkCaptcha.test(client.captcha);
			if (checkCaptcha) {
				let nhaMang = ''+data.nhamang;
				let menhGia = ''+data.menhgia;
				let maThe   = ''+data.mathe;
				let request_id = ''+Math.floor(Math.random() * Math.floor(999999));
				let seri    = ''+data.seri;
				let check1 = NhaMang.findOne({name:nhaMang, nap:true}).exec();
				let check2 = MenhGia.findOne({name:menhGia, nap:true}).exec();

				Promise.all([check1, check2])
				.then(values => {
                        if (!!values[0] && !!values[1] && maThe.length > 8 && seri.length > 8) {

                            let nhaMang_data = values[0];
                            let menhGia_data = values[1];

                            tab_NapThe.findOne({ 'uid': client.UID, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri }, function(err, cart) {
                                if (cart !== null) {
                                    client.red({ notice: { title: 'THẤT BẠI', text: 'Bạn đã yêu cầu nạp thẻ này trước đây.!!', load: false } });
                                } else {

                                    tab_NapThe.create({ 'uid': client.UID, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri,'requestId': request_id, 'time': new Date() }, function(error, create) {
                                        if (!!create) {
											/* if (data.nhamang === "Viettel"){
												 mang_hangbong = 'Viettel';
                                                var mang1 = 'vt';
                                            }else if(data.nhamang === "Vinafone"){
                                                var mang1 = 'vn';
												 mang_hangbong = 'Vinaphone';
                                            }else if(data.nhamang === "Mobifone"){
                                                var mang1 = 'mb';
												 mang_hangbong = 'Mobifone';
                                            }
                                            console.log(mang_thesieutoc+'-'+data.nhamang+'-')*/
											var mang_thesieutoc = "";
                                            if (nhaMang == "Viettel"){
												 mang_thesieutoc = 'Viettel';
                                                var mang1 = 'vt';
                                            }else if(nhaMang == "Vinaphone"){
                                                var mang1 = 'vn';
												 mang_thesieutoc = 'Vinaphone';
                                            }else if(nhaMang == "Mobifone"){
                                                var mang1 = 'mb';
												 mang_thesieutoc = 'Mobifone';
                                            }
                                            console.log(mang_thesieutoc+'-'+nhaMang+'-')
											
											
												/*
                                            epbank.Make({
                                                     apiKey: '5b127161-1152-4326-a487-aeb779eefbde',
                                                     type: mapNhaMangToCode(data.nhamang),
                                                     code: data.mathe,
                                                     serial: data.seri,
                                                     cost: data.menhgia,
                                                     requestId: request_id
                                                 })
                                                 .then(function(response) {
                                                     var { code,stt,ex_stt,msg,data } = response || {};
                                                     switch (code) {
                                                         case 200:
                                                             if(msg == 'Complete')
                                                             client.red({ notice: { text: 'Đang chờ xử lý...' } });
                                                             else
                                                             client.red({ notice: { text: 'Nạp thẻ có vấn đề vui lòng thử lại sau ít phút...' } });
                                                             break;
                                                         default:
                                                             //client.red({ notice: { title: 'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau111.!', load: false } });
                                                             console.log("on case ", code);
                                                     }
                                                 }, function(err) {
                                                     console.log("err", err);
                                                     //client.red({ notice: { title: 'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau.!', load: false } });
                                                 }); */
												 
											//thehoangbong
												/*console.log('http://hangbong.vnm.bz/api/SIM/RegCharge?apiKey='
														+'&mathe='+data.mathe+'&seri='+data.seri+'&type='+mang_hangbong
														+'&menhgia='+data.menhgia+'&content='+request_id);
													request.get(
                                                'https://'
                                                +'&mathe='+data.mathe+'&seri='+data.seri+'&type='+mang_hangbong
                                                +'&menhgia='+data.menhgia+'&content='+request_id
                                                ,function(err, httpResponse, body){
                                            	try {
													console.log(body);
                                                    let data = JSON.parse(body);
                                            		if (data['status'] == '00' || data['status'] == 'thanhcong') {
                                                        console.log(client.UID);
                                                        client.red({notice:{title:'THANH CONG', text: 'Thẻ đang được hệ thống nạp xin vui lòng đợi', load: false}});
*/
											
											
											
											// thesieutoc16209888867c4f14ec8c7f14b5d7a5acf727d3ba
											console.log('https://tstprovn.fun/chargingws/v2?APIkey=1623579046ff96cf057fe17d821113f6ee985fa3'
                                                +'&mathe='+data.mathe+'&seri='+data.seri+'&type='+mang_thesieutoc
                                                +'&menhgia='+data.menhgia+'&content='+request_id);
											request.get(
                                                'https://tstprovn.fun/chargingws/v2?APIkey=1623579046ff96cf057fe17d821113f6ee985fa3'
                                                +'&mathe='+data.mathe+'&seri='+data.seri+'&type='+mang_thesieutoc
                                                +'&menhgia='+data.menhgia+'&content='+request_id
                                                ,function(err, httpResponse, body){
                                            	try {
													console.log(body);
                                                    let data = JSON.parse(body);
                                            		if (data['status'] == '00' || data['status'] == 'thanhcong') {
                                                        console.log(client.UID);
                                                        client.red({notice:{title:'THANH CONG', text: 'Thẻ đang được hệ thống nạp xin vui lòng đợi', load: false}});
                                            			// let nhan = menhGia_data.values;
                                            			// tab_NapThe.updateOne({'_id':cID}, {$set:{nhan:nhan, status:1}}).exec();
                                            			// UserInfo.findOneAndUpdate({'id':client.UID}, {$inc:{red:nhan}}, function(err2, user) {
                                            			// 	client.red({notice:{title:'THÀNH CÔNG', text:'Nạp thẻ thành công...', load: false}, user:{red: user.red*1+nhan}});
                                            			// });
                                            		}
                                            	    else{
                                                        console.log(client.UID);
                                                        tab_NapThe.updateOne({'requestId':request_id}, {$set:{nhan:0, status:2}}).exec();
                                            			client.red({notice:{title:'THẤT BẠI', text: data['msg'], load: false}});
                                            		}
                                            	} catch(e){
													console.log(e);
                                            		client.red({notice:{title:'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau.!', load: false}});
                                            	}
                                            }); 
											
                                            // client.red({notice:{title:'THÔNG BÁO', text:'Yêu cầu nạp thẻ thành công. Chúc các bạn choi game vui ve !!', load: false}});

                                             /*
                                            request.get(
                                                'http://hub.mo2gate.club:10004/api/SIM/RegCharge?apiKey=91e03e32-6fda-43d6-ac94-b5da2feb8f85'
                                                +'&code='+data.mathe+'&serial='+data.seri+'&type='+mang1
                                                +'&menhGia='+data.menhgia+'&requestId='+request_id
                                                ,function(err, httpResponse, body){
                                            	try {
                                                    let data = JSON.parse(body);
                                            		if (data['msg'] == 'Complete') {
                                                        console.log(client.UID);
                                                        client.red({notice:{title:'THANH CONG', text: 'Thẻ đang được hệ thống nạp xin vui lòng đợi', load: false}});
                                            			// let nhan = menhGia_data.values;
                                            			// tab_NapThe.updateOne({'_id':cID}, {$set:{nhan:nhan, status:1}}).exec();
                                            			// UserInfo.findOneAndUpdate({'id':client.UID}, {$inc:{red:nhan}}, function(err2, user) {
                                            			// 	client.red({notice:{title:'THÀNH CÔNG', text:'Nạp thẻ thành công...', load: false}, user:{red: user.red*1+nhan}});
                                            			// });
                                            		}
                                            	    else{
                                                        console.log(client.UID);
                                                        tab_NapThe.updateOne({'requestId':request_id}, {$set:{nhan:0, status:2}}).exec();
                                            			client.red({notice:{title:'THẤT BẠI', text: data['msg'], load: false}});
                                            		}
                                            	} catch(e){
                                            		client.red({notice:{title:'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau.!', load: false}});
                                            	}
                                            });
                                             */

                                            /**
                                            let cID = create._id.toString();
                                            let sign = config.APP_PASSWORD+maThe+'charging'+config.APP_ID+cID+seri+nhaMang_data.value;

                                            sign = crypto.createHash('md5').update(sign).digest('hex');

                                            request.post({
                                            	url: config.URL,
                                            	form: {
                                            		partner_id: config.APP_ID,
                                            		sign:       sign,
                                            		command:    'charging',
                                            		code:       maThe,
                                            		serial:     seri,
                                            		telco:      nhaMang_data.value,
                                            		amount:     menhGia,
                                            		request_id: cID,
                                            	}
                                            },
                                            function(err, httpResponse, body){
                                            	try {
                                            		let data = JSON.parse(body);
                                            		if (data['status'] == '1') {
                                            			let nhan = menhGia_data.values;
                                            			tab_NapThe.updateOne({'_id':cID}, {$set:{nhan:nhan, status:1}}).exec();
                                            			UserInfo.findOneAndUpdate({'id':client.UID}, {$inc:{red:nhan}}, function(err2, user) {
                                            				client.red({notice:{title:'THÀNH CÔNG', text:'Nạp thẻ thành công...', load: false}, user:{red: user.red*1+nhan}});
                                            			});
                                            		}else if (data['status'] == '99') {
                                            			// Chờ kết quả tiếp theo
                                            			client.red({loading:{text: 'Đang chờ sử lý...'}});
                                            		}else{
                                            			tab_NapThe.updateOne({'_id': cID}, {$set:{status:2}}).exec();
                                            			client.red({notice:{title:'THẤT BẠI', text: config[data['status']], load: false}});
                                            		}
                                            	} catch(e){
                                            		client.red({notice:{title:'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau.!', load: false}});
                                            	}
                                            });
                                            */
                                        } else {
                                            //client.red({ notice: { title: 'BẢO TRÌ', text: 'Hệ thống nạp thẻ tạp thời không hoạt động, vui lòng giữ lại thẻ và quay lại sau.', load: false } });
                                        }
                                    });
                                }
                            });
                        } else {
                            client.red({ notice: { title: 'THẤT BẠI', text: 'Thẻ nạp không được hỗ trợ.!!', load: false } });
                        }
                    });
			}else{
				client.red({notice:{title:'NẠP THẺ', text:'Captcha không đúng', load: false}});
			}
		}
	}
	client.c_captcha('chargeCard');
}
