package org.openhdfpv.angularbackend.graphql

import graphql.execution.instrumentation.Instrumentation
import graphql.execution.instrumentation.ChainedInstrumentation
import graphql.analysis.MaxQueryComplexityInstrumentation
import graphql.analysis.MaxQueryDepthInstrumentation
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(GraphqlLimitProperties::class)
class GraphqlInstrumentationConfig(
    private val limitProperties: GraphqlLimitProperties
) {
    @Bean
    fun graphQlInstrumentation(): Instrumentation =
        ChainedInstrumentation(
            listOf(
                MaxQueryDepthInstrumentation(limitProperties.depth),
                MaxQueryComplexityInstrumentation(limitProperties.complexity)
            )
        )
}

@ConfigurationProperties(prefix = "graphql.limits")
class GraphqlLimitProperties {
    var depth: Int = 12
    var complexity: Int = 250
}
