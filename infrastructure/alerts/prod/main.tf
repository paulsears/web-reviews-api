resource "newrelic_nrql_alert_condition" "yourservicename_error_rate_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template Error Rate Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT (count(apm.service.error.count) / count(apm.service.transaction.duration)) * 100 AS 'Error rate (%)' FROM Metric WHERE entity.guid IN ('<INSERT_NR_GUID>') FACET appName"
    data_account_id = 383185
  }

  critical {
    operator = "above"
    threshold = 2
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_only"
  signal_seasonality = "new_relic_calculation"
  title_template = "apfm-nestjs-template Error Rate Deviation"
}

resource "newrelic_nrql_alert_condition" "yourservicename_apdex_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template APDEX Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT apdex(newrelic.timeslice.value) AS 'Apdex' FROM Metric WHERE metricTimesliceName = 'Apdex' AND `entity.guid` IN ('<INSERT_NR_GUID>') FACET `entity.guid`"
  }

  critical {
    operator = "above"
    threshold = 2
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_and_lower"
  signal_seasonality = "new_relic_calculation"
}

resource "newrelic_nrql_alert_condition" "yourservicename_transaction_time_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template Transaction Time Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT average(newrelic.timeslice.value) AS 'WebTransaction' FROM Metric WHERE metricTimesliceName = 'WebTransaction' AND `entity.guid` IN ('<INSERT_NR_GUID>') FACET `entity.guid`"
  }

  critical {
    operator = "above"
    threshold = 2
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_and_lower"
  signal_seasonality = "new_relic_calculation"
}

resource "newrelic_nrql_alert_condition" "yourservicename_throughput_rate_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template Throughput Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT count(apm.service.transaction.duration) AS 'Throughput' FROM Metric WHERE entity.guid IN ('<INSERT_NR_GUID>') FACET appName"
  }

  critical {
    operator = "above"
    threshold = 2
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_and_lower"
  signal_seasonality = "new_relic_calculation"
}

resource "newrelic_nrql_alert_condition" "yourservicename_cpu_utilization" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template CPU Utilization"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT max(docker.container.cpuPercent) AS 'CPU utilization (%)' FROM Metric WHERE `ecsClusterArn` = 'arn:aws:ecs:us-west-2:451834275279:cluster/default' AND `name` = 'apfm-nestjs-template' FACET entity.name"
  }

  critical {
    operator = "above"
    threshold = 70
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_and_lower"
  signal_seasonality = "new_relic_calculation"
}



resource "newrelic_nrql_alert_condition" "yourservicename_cpu_utilization_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template CPU Utilization Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT max(docker.container.cpuPercent) AS 'CPU utilization (%)' FROM Metric WHERE `ecsClusterArn` = 'arn:aws:ecs:us-west-2:451834275279:cluster/default' AND `name` = 'apfm-nestjs-template' FACET entity.name"
  }

  critical {
    operator = "above"
    threshold = 2
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_and_lower"
  signal_seasonality = "new_relic_calculation"
}


resource "newrelic_nrql_alert_condition" "yourservicename_memory_utilization" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "static"
  name = "apfm-nestjs-template Memory Utilization"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {

    query = trimspace(<<-EOT
    SELECT
      (average(docker.container.memoryUsageBytes) / average(docker.container.memorySizeLimitBytes)) * 100
      AS 'Memory Usage %'
    FROM Metric
    WHERE `ecsClusterArn` = 'arn:aws:ecs:us-west-2:451834275279:cluster/default' AND `name` = 'apfm-nestjs-template'

    EOT
    )

  }

  critical {
    operator = "above"
    threshold = 70
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
}

resource "newrelic_nrql_alert_condition" "yourservicename_memory_utilization_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template Memory Utilization Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {

    query = trimspace(<<-EOT
    SELECT
      (average(docker.container.memoryUsageBytes) / average(docker.container.memorySizeLimitBytes)) * 100
      AS 'Memory Usage %'
    FROM Metric
    WHERE `ecsClusterArn` = 'arn:aws:ecs:us-west-2:451834275279:cluster/default' AND `name` = 'apfm-nestjs-template'

    EOT
    )

  }

  critical {
    operator = "above"
    threshold = 3
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_and_lower"
  signal_seasonality = "new_relic_calculation"
}

resource "newrelic_nrql_alert_condition" "yourservicename_logged_errors_deviation" {
  account_id = 383185
  policy_id = <INSERT_ALERT_POLICY_ID>
  type = "baseline"
  name = "apfm-nestjs-template Logged Errors Deviation"
  enabled = true
  violation_time_limit_seconds = 259200

  nrql {
    query = "SELECT count(*) FROM Log WHERE `entity.name` = 'apfm-nestjs-template-prod' AND `level` = 'error' "
  }

  critical {
    operator = "above"
    threshold = 1
    threshold_duration = 300
    threshold_occurrences = "all"
  }
  fill_option = "none"
  aggregation_window = 60
  aggregation_method = "event_flow"
  aggregation_delay = 120
  baseline_direction = "upper_only"
  signal_seasonality = "new_relic_calculation"
}
