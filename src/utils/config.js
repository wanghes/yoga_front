const developmentUrl = "http://127.0.0.1:8000"

export const BASEURL = process.env.NODE_ENV == "development" ? developmentUrl : "";