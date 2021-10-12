const developmentUrl = "http://venues.yoga.com";
const developmentImgUploadUrl = "http://assets.yoga.com";
const productionUrl = "http://api.yogaguanjia.com";
const productionImgUploadUrl = "http://source.yogaguanjia.com";

// 接口
export const BASEURL = process.env.NODE_ENV == "development" ? developmentUrl : productionUrl;
//上传接口的域名
export const UPLOADBASEURL = process.env.NODE_ENV == "development" ? developmentImgUploadUrl : productionImgUploadUrl;
// UEditer 使用的上传接口的域名
export const UEDITOR_DOMAIN = process.env.NODE_ENV == "development" ? developmentImgUploadUrl : productionImgUploadUrl;