import io.restassured.RestAssured
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.*
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Testcontainers

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@TestExecutionListeners(
    listeners = [IntegrationTest.ExecutionListener::class],
    mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS
)
annotation class IntegrationTest {


    companion object {
        var postgres: PostgreSQLContainer<*> = PostgreSQLContainer(
            "postgres:17-alpine"
        )

        @BeforeAll
        @JvmStatic
        internal fun beforeAll() {
            postgres.start()
        }

        @AfterAll
        @JvmStatic
        internal fun afterAll() {
            postgres.stop()
        }

        @DynamicPropertySource
        @JvmStatic
        internal fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url") { postgres.jdbcUrl }
            registry.add("spring.datasource.username") { postgres.username }
            registry.add("spring.datasource.password") { postgres.password }
            registry.add("spring.flyway.url") { postgres.jdbcUrl }
            registry.add("spring.flyway.user") { postgres.username }
            registry.add("spring.flyway.password") { postgres.password }
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
