import io.restassured.RestAssured
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestContext
import org.springframework.test.context.TestExecutionListener
import org.springframework.test.context.TestExecutionListeners

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestExecutionListeners(
    listeners = [IntegrationTest.ExecutionListener::class],
    mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS
)
annotation class IntegrationTest {
    class ExecutionListener : TestExecutionListener {
        override fun beforeTestMethod(testContext: TestContext) {
            val applicationContext = testContext.applicationContext

            val port = applicationContext.environment.getProperty("local.server.port")?.toInt()
                ?: throw IllegalStateException("Couldn't load local server port")

            RestAssured.baseURI = "http://localhost:$port/api"
        }
    }
}
