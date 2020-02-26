import _ from "lodash";

export class GenericDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    const jsonData = instanceSettings.jsonData;
  }

  query(options) {
    var query = this.buildQueryParameters(options);
    console.log(query.targets)
    query.targets = query.targets.filter(t => !t.hide);
    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    return this.customDoRequest({
      url: `api/datasources/proxy/${this.id}/checksroute`,
      method: 'GET',
      data: query,
    }).then(result => this.mapToTable(result));
  }

  mapToTable(result) {
    return {'data':[{
      'columns':[
        {"text":"name"},
        {"text":"tags"},
        {"text":"Description"},
        {
          "text":"Grace",
          "unit":"s",
        },
        {"text":"Total Number of Pings"},
        {"text":"status"},
        {
          "text":"Last Ping",
          "type":"time",
          "sort":true,
          "asc":true,
        },
        {
          "text":"Next Ping",
          "type":"time",
          "sort":true,
          "asc":true,
        },
        {"text":"unique_key"},
        {"text":"schedule"},
        {"text":"tz"},
      ],
      'rows':_.map(result.data.checks,(o,i)=>{return Object.keys(o).map(function(key){
          return o[key];
        });}),
      'type':'table',
    }]}
  }


  testDatasource() {
    return this.doRequest({
      url: `api/datasources/proxy/${this.id}/checksroute`,
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  annotationQuery(options) {
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    return this.doRequest({
      url: `api/datasources/proxy/${this.id}/checksroute`,
      method: 'POST',
      data: annotationQuery
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(query) {
    // var interpolated = {
    //     target: this.templateSrv.replace(query, null, 'regex')
    // };

    return this.doRequest({
      url: `api/datasources/proxy/${this.id}/checksroute`,
      method: 'GET',
    }).then(result => this.mapToTextValue(result));
  }

  mapToTextValue(result) {
    // console.log(result.data)
    return _.map(result.data.checks, (o, i) => {
        // return {text: o.name, value: o.unique_key};
        return o.name;
    });
    // b = [{text:'',value:null}].concat(a)
    // console.log(b)

    // return b
  }

  doRequest(options) {
    // console.log('Do Request options:')
    // console.log(options)
    options.withCredentials = this.withCredentials;
    // options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }

  customDoRequest(options){
    console.log('Custom Request:')
    console.log(options)

    return this.backendSrv.datasourceRequest(options).then(response => {
      if (options.data.targets.length == 1){
        console.log('Target Response!')
        console.log(response)
        response.data.checks = _.filter(
          response.data.checks,
          (o,i) => {
            return options.data.targets[0].target == o.unique_key;
          });
      }
      return response
    });

  }

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie'
      };
    });

    options.targets = targets;

    return options;
  }

  getTagKeys(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/tag-keys',
        method: 'POST',
        data: options
      }).then(result => {
        return resolve(result.data);
      });
    });
  }

  getTagValues(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/tag-values',
        method: 'POST',
        data: options
      }).then(result => {
        return resolve(result.data);
      });
    });
  }

}
