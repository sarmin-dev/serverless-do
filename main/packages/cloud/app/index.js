const unirest = require("unirest");
const is_valid_url = require("is-valid-http-url");

const header_curl = {
    'from': 'googlebot(at)googlebot.com',
    'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G920A) AppleWebKit (KHTML, like Gecko) Chrome Mobile Safari (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)'
};

const send404 = async ()=>{
    return {
        statusCode: 404,
        body:"404"
    };
};

const download = async (url)=>{
    const sendBack = {
        "status-code":404,
        "response-headers":{},
        "body":""
    };
    return new Promise((resolve,reject)=>{
        unirest.request({
            uri: url,
            headers: header_curl,
            gzip: true,
        }).on('error', error => {
            resolve(sendBack);
        }).on('response',(resp)=>{
            try{
                sendBack["status-code"] = resp.statusCode;
                sendBack["response-headers"] = resp.headers;
            }catch(e){};
        }).on('data', (data)=>{
            sendBack.body+=data;
        }).on('end',()=>{
            resolve(sendBack);
        });
    });
};

module.exports.main = async (args)=>{
    const method = args["__ow_method"];
    const path = args["__ow_path"];
    const request = args.req;
    if(method=="get" && request){
        const valid_url = await is_valid_url(request);
        if(valid_url){
            const data = await download(request);
            return {
                statusCode: 200,
                body: data
            };
        }else{
            return send404();
        };
    }else{
        return send404();
    };
};