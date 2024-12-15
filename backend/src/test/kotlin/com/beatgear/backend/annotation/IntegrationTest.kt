import io.restassured.RestAssured
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.*
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Testcontainers

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

        override fun initialize(applicationContext: ConfigurableApplicationContext) {
            TestPropertyValues.of(
                "spring.datasource.url=${postgres.jdbcUrl}",
                "spring.datasource.username=${postgres.username}",
                "spring.datasource.password=${postgres.password}",
            ).applyTo(applicationContext.environment)
        }

        companion object {
            val postgres =
                PostgreSQLContainer<Nothing>("postgres:16-alpine")
                    .apply { withReuse(true) }
                    .apply { start() }
        }
    }

    class ExecutionListener : TestExecutionListener {
        override fun beforeTestMethod(testContext: TestContext) {
            val applicationContext = testContext.applicationContext

            val port = applicationContext.environment.getProperty("local.server.port")?.toInt()
                ?: throw IllegalStateException("Couldn't load local server port")

            RestAssured.baseURI = "http://localhost:$port/api"
        }
    }
}
