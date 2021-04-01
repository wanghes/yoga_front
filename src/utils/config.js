const developmentUrl = "http://yadmin.com";
const imgUploadUrl= "http://assets.yoga.com";
// 接口
export const BASEURL = process.env.NODE_ENV == "development" ? developmentUrl : developmentUrl;

export const UPLOADBASEURL = process.env.NODE_ENV == "development" ? imgUploadUrl : imgUploadUrl;

// UEditer 使用的上传接口的域名
export const UEDITOR_DOMAIN = process.env.NODE_ENV == "development" ? imgUploadUrl : imgUploadUrl;