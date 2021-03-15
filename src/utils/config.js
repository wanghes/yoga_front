const developmentUrl = "http://127.0.0.1:8000";
// 接口
export const BASEURL = process.env.NODE_ENV == "development" ? developmentUrl : "";

// UEditer 使用的上传接口的域名
export const UEDITOR_DOMAIN = process.env.NODE_ENV == "development" ? developmentUrl : "";