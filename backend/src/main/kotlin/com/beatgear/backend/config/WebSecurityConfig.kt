import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.security.web.SecurityFilterChain
import java.util.stream.Collectors

@Configuration
@EnableWebSecurity
class WebSecurityConfig {
    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        httpSecurity
            .authorizeHttpRequests { registry ->
                registry
                    .requestMatchers("/api/**").authenticated()
            }
            .oauth2ResourceServer { oauth2Configurer ->
                oauth2Configurer.jwt { jwtConfigurer ->
                    jwtConfigurer.jwtAuthenticationConverter { jwt ->
                        val realmAccess: Map<String, Collection<String>> =
                            jwt.getClaim("realm_access")
                        val roles = realmAccess["roles"]!!
                        val grantedAuthorities = roles.stream()
                            .map { role: String -> SimpleGrantedAuthority(role) }
                            .collect(Collectors.toList())
                        JwtAuthenticationToken(jwt, grantedAuthorities)
                    }
                }
            }

        return httpSecurity.build()
    }
}