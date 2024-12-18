package com.beatgear.backend.components

import com.beatgear.backend.dto.AuthenticatedUser
import org.springframework.core.convert.converter.Converter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import org.springframework.stereotype.Component
import java.util.*

@Component
class JwtAuthenticationConverter : Converter<Jwt, AbstractAuthenticationToken> {

    private val grantedAuthoritiesConverter = JwtGrantedAuthoritiesConverter()

    override fun convert(jwt: Jwt): AbstractAuthenticationToken {
        val userId = jwt.getClaimAsString("sub") // Keycloak UUID
        val username = jwt.getClaimAsString("preferred_username")
        val roles = jwt.getClaimAsStringList("roles") ?: emptyList()

        val authenticatedUser = AuthenticatedUser(UUID.fromString(userId), username, roles)

        val authorities = grantedAuthoritiesConverter.convert(jwt)
        return UsernamePasswordAuthenticationToken(authenticatedUser, null, authorities)
    }
}
