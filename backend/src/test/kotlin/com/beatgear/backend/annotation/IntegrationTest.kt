import io.restassured.RestAssured
import org.apache.http.client.utils.URIBuilder
import org.junit.jupiter.api.BeforeAll
import org.springframework.boot.json.JacksonJsonParser
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.http.MediaType
import org.springframework.test.context.*
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Testcontainers
import java.util.*

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ContextConfiguration(initializers = [IntegrationTest.Initializer::class])
@TestExecutionListeners(
    listeners = [IntegrationTest.ExecutionListener::class],
    mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS
)
annotation class IntegrationTest {
    class Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {

        lateinit var issuerUrl: String

        override fun initialize(applicationContext: ConfigurableApplicationContext) {
            val environment = applicationContext.environment

            issuerUrl = environment.getProperty("spring.security.oauth2.resourceserver.jwt.issuer-uri")
                ?: throw IllegalStateException("Issuer URI is not configured!")

            TestPropertyValues.of(
                "spring.datasource.url=${postgres.jdbcUrl}",
                "spring.datasource.username=${postgres.username}",
                "spring.datasource.password=${postgres.password}",
            ).applyTo(applicationContext.environment)
        }

        companion object {
            val postgres = PostgreSQLContainer<Nothing>("postgres:16-alpine").apply { start() }
        }
    }

    class ExecutionListener : TestExecutionListener {
        override fun beforeTestMethod(testContext: TestContext) {
            val applicationContext = testContext.applicationContext

            val port = applicationContext.environment.getProperty("local.server.port")?.toInt()
                ?: throw IllegalStateException("Couldn't load local server port")

            RestAssured.baseURI = "http://localhost:$port"
        }
    }
}
