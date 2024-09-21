class ResponseFormatter {
    static send(res, data, message = "Success", statusCode = 200) {
      return res.status(statusCode).json({
        status: "success",
        message,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  export { ResponseFormatter };
  