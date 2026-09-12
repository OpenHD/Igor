package org.openhdfpv.angularbackend.special
import jakarta.servlet.RequestDispatcher
import jakarta.servlet.http.HttpServletRequest
import org.springframework.boot.webmvc.error.ErrorController
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping


@Controller
class CustomErrorController : ErrorController {

    @RequestMapping("/error")
    @org.springframework.web.bind.annotation.ResponseBody
    fun handleError(request: HttpServletRequest): org.springframework.http.ResponseEntity<Map<String, Any>> {
        val status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)
        val statusCode = status?.toString()?.toIntOrNull() ?: 500
        
        val errorAttributes = mapOf(
            "timestamp" to java.util.Date(),
            "status" to statusCode,
            "error" to HttpStatus.valueOf(statusCode).reasonPhrase,
            "message" to (request.getAttribute(RequestDispatcher.ERROR_MESSAGE) ?: "No message available")
        )
        
        return org.springframework.http.ResponseEntity(errorAttributes, HttpStatus.valueOf(statusCode))
    }
}
