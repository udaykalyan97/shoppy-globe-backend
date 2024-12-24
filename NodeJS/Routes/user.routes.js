import { userRegister, userLogin } from "../Controller/user.controller.js";

export function userRoutes(app){
    app.post("/register", userRegister);
    app.post("/login", userLogin);
}