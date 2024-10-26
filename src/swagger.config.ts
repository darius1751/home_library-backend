import { JsonObject } from "swagger-ui-express";

export const swaggerConfig: JsonObject = {
    swagger: "2.0",
    info: {
        description: "This swagger page describe endpoints of the api home_library",
        version: "0.0.1",
        title: "Swagger Home Library",
        contact: {
            email: "lupequi12@gmail.com"
        }
    },
    host: `localhost:${process.env.PORT || 4000}`,
    basePath: "/api/v1",
    paths: {
        
    }

}
