## Grafana HealthChecks.io Datasource - a modified generic backend datasource

More documentation about datasource plugins can be found in the [Docs](https://github.com/grafana/grafana/blob/master/docs/sources/plugins/developing/datasources.md).

This also serves as a living example implementation of a datasource.

Your backend needs to implement 4 urls:

 * `/` should return 200 ok. Used for "Test connection" on the datasource config page.
 * `/search` used by the find metric options on the query tab in panels.
 * `/query` should return metrics based on input.
 * `/annotations` should return annotations.
 
Those two urls are optional:

 * `/tag-keys` should return tag keys for ad hoc filters.
 * `/tag-values` should return tag values for ad hoc filters.

## Installation

To install this plugin using the `grafana-cli` tool:
```
sudo grafana-cli plugins install grafana-simple-json-datasource
sudo service grafana-server restart
```
See [here](https://grafana.com/plugins/grafana-simple-json-datasource/installation) for more information.