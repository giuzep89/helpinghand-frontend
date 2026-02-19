import {jwtDecode} from "jwt-decode";

export function isTokenExpired(){
    const token = localStorage.getItem("token");

    if (!token){
        console.log("No token present");
        return true;
    }

    try {
        const decodedToken = jwtDecode(token);
        const expiryInMilliseconds = decodedToken.exp * 1000;
        const currentDate = Date.now();

        return expiryInMilliseconds < currentDate;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
}