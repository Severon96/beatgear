package com.beatgear.backend.util

import org.apache.http.client.utils.URIBuilder
import org.springframework.boot.json.JacksonJsonParser
import org.springframework.http.MediaType
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import java.util.*

object KeycloakUtil {

    fun getAccessToken(issuerUrl: String): String {
        val authorizationURI = URIBuilder("$issuerUrl/protocol/openid-connect/token").build()

        val webClient = WebClient.builder().build()
        val formData = LinkedMultiValueMap<String, String>()
        formData["grant_type"] = Collections.singletonList("password")
        formData["client_id"] = Collections.singletonList("test-client")
        formData["client_secret"] = Collections.singletonList("nXuaXbAPEDGw5GcZNowdr2lXRyzaTNoh")
        formData["username"] = Collections.singletonList("test-user")
        formData["password"] = Collections.singletonList("test")

        val result = webClient.post()
            .uri(authorizationURI)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(BodyInserters.fromFormData(formData))
            .retrieve()
            .bodyToMono(String::class.java)
            .block()

        val jsonParser = JacksonJsonParser()
        return "Bearer " + jsonParser.parseMap(result)["access_token"].toString()
    }

}