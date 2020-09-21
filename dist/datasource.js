"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericDatasource = exports.GenericDatasource = function () {
  function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, GenericDatasource);

    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    var jsonData = instanceSettings.jsonData;
  }

  _createClass(GenericDatasource, [{
    key: "query",
    value: function query(options) {
      var _this = this;

      var query = this.buildQueryParameters(options);
      query.targets = query.targets.filter(function (t) {
        return !t.hide;
      });
      if (query.targets.length <= 0) {
        return this.q.when({ data: [] });
      }
      switch (query.targets[0].mode) {
        case 2:
          var queryUrl = "api/datasources/proxy/${this.id}/checksroute/${query.targets[0].uuid}/flips/?start=${query.range.from.unix()}&end=${query.range.to.unix()}";
          break;
        default:
          var queryUrl = "api/datasources/proxy/${this.id}/checksroute/${query.targets[0].uuid}";
          break;
      }
      return this.customDoRequest({
        url: queryUrl,
        method: 'GET'
      }, query).then(function (result) {
        return _this.mapToTable(result, query.targets[0].mode);
      }).catch(function (error) {
        console.log(error);
        if (error.status == 404) {
          return {
            status: "error",
            title: "Connection failed",
            message: "Connection failed: " + error.data.message
          };
        }
      });
    }
  }, {
    key: "mapToTable",
    value: function mapToTable(result, mode) {
      var processingArray = result.data.checks;
      if (mode == 2) {
        return { 'data': [{
            'columns': [{ "text": "time", "type": "time" }, { "status": "text" }], 'rows': _lodash2.default.map(result.data.flips, function (o, i) {
              return Object.keys(o).map(function (key) {
                return o[key];
              });
            }) }] };
      } else if (mode == 1) {
        processingArray = [result.data];
        if (result.data.hasOwnProperty('checks')) {
          processingArray = [];
        }
      }
      return { 'data': [{
          'columns': [{ "text": "name" }, { "text": "tags" }, { "text": "Description" }, {
            "text": "Grace",
            "unit": "s"
          }, { "text": "Total Number of Pings" }, { "text": "status" }, {
            "text": "Last Ping",
            "type": "time",
            "sort": true,
            "asc": true
          }, {
            "text": "Next Ping",
            "type": "time",
            "sort": true,
            "asc": true
          }, { "text": "manual_resume" }, { "text": "unique_key" }, { "text": "schedule" }, { "text": "tz" }],
          'rows': _lodash2.default.map(processingArray, function (o, i) {
            return Object.keys(o).map(function (key) {
              if (key == 'status') {
                var x = { "down": 0,
                  "grace": 1,
                  "started": 2,
                  "paused": 3,
                  "new": 4,
                  "up": 5
                };
                return x[o[key]];
              }
              return o[key];
            });
          }),
          'type': 'table'
        }] };
    }
  }, {
    key: "testDatasource",
    value: function testDatasource() {
      return this.doRequest({
        url: "api/datasources/proxy/" + this.id + "/checksroute",
        method: 'GET'
      }).then(function (response) {
        if (response.status === 200) {
          return { status: "success", message: "Data source is working", title: "Success" };
        }
      });
    }
  }, {
    key: "annotationQuery",
    value: function annotationQuery(options) {
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
        url: "api/datasources/proxy/" + this.id + "/checksroute",
        method: 'POST',
        data: annotationQuery
      }).then(function (result) {
        return result.data;
      });
    }
  }, {
    key: "metricFindQuery",
    value: function metricFindQuery(query) {
      var _this2 = this;

      return this.doRequest({
        url: "api/datasources/proxy/" + this.id + "/checksroute",
        method: 'GET'
      }).then(function (result) {
        return _this2.mapResultToList(result);
      });
    }
  }, {
    key: "mapResultToList",
    value: function mapResultToList(result) {
      return _lodash2.default.map(result.data.checks, function (o, i) {
        return { name: o.name, code: o.unique_key };
      });
    }
  }, {
    key: "doRequest",
    value: function doRequest(options) {
      options.withCredentials = this.withCredentials;
      return this.backendSrv.datasourceRequest(options);
    }
  }, {
    key: "customDoRequest",
    value: function customDoRequest(options, additionalData) {
      return this.backendSrv.datasourceRequest(options).then(function (response) {
        if (additionalData.targets.length == 1) {
          if (additionalData.targets[0].target === "") {
            response.data.checks = response.data.checks;
          } else {
            // We should never get here now because we're returned a filtered result
          }
        }
        return response;
      });
    }
  }, {
    key: "buildQueryParameters",
    value: function buildQueryParameters(options) {
      var _this3 = this;

      //remove placeholder targets
      options.targets = _lodash2.default.filter(options.targets, function (target) {
        return target.check !== 'Select Check';
      });

      var targets = _lodash2.default.map(options.targets, function (target) {
        return {
          check: _this3.templateSrv.replace(target.check, options.scopedVars, 'regex'),
          refId: target.refId,
          mode: target.mode,
          hide: target.hide,
          uuid: target.uuid,
          type: target.type || 'timeserie'
        };
      });

      options.targets = targets;

      return options;
    }
  }, {
    key: "getTagKeys",
    value: function getTagKeys(options) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.doRequest({
          url: _this4.url + '/tag-keys',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }, {
    key: "getTagValues",
    value: function getTagValues(options) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.doRequest({
          url: _this5.url + '/tag-values',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }]);

  return GenericDatasource;
}();
//# sourceMappingURL=datasource.js.map
