'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

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
    key: 'query',
    value: function query(options) {
      var _this = this;

      var query = this.buildQueryParameters(options);
      // query.targets = query.targets.filter(t => !t.hide);
      if (query.targets.length <= 0) {
        return this.q.when({ data: [] });
      }

      // if (this.templateSrv.getAdhocFilters) {
      //   query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
      // } else {
      //   query.adhocFilters = [];
      // }

      return this.doRequest({
        url: 'api/datasources/proxy/${this.id}/checksroute',
        method: 'GET'
      }).then(function (result) {
        return _this.mapToTable(result);
      });
    }
  }, {
    key: 'mapToTable',
    value: function mapToTable(result) {
      return [{
        'columns': [{ "text": "name" }, { "text": "tags" }, { "text": "desc" }, { "text": "grace" }, { "text": "n_pings" }, { "text": "status" }],
        'rows': _lodash2.default.map(result.data.checks, function (o, i) {
          return Object.keys(o).map(function (key) {
            return o[key];
          });
        }),
        'type': 'table'
      }];
    }
  }, {
    key: 'testDatasource',
    value: function testDatasource() {
      return this.doRequest({
        url: 'api/datasources/proxy/${this.id}/checksroute',
        method: 'GET'
      }).then(function (response) {
        if (response.status === 200) {
          return { status: "success", message: "Data source is working", title: "Success" };
        }
      });
    }
  }, {
    key: 'annotationQuery',
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
        url: this.url + '/annotations',
        method: 'POST',
        data: annotationQuery
      }).then(function (result) {
        return result.data;
      });
    }
  }, {
    key: 'metricFindQuery',
    value: function metricFindQuery(query) {
      var interpolated = {
        target: this.templateSrv.replace(query, null, 'regex')
      };

      return this.doRequest({
        url: 'api/datasources/proxy/${this.id}/checksroute',
        method: 'GET'
        // data: interpolated,
      }).then(this.mapToTextValue);
    }
  }, {
    key: 'mapToTextValue',
    value: function mapToTextValue(result) {
      // return _.map(result.data.checks, (d, i) => {
      //   if (d && d.text && d.value) {
      //     return { text: d.text, value: d.value };
      //   } else if (_.isObject(d)) {
      //     return { text: d, value: i};
      //   }
      //   return { text: d, value: d };
      // });
      return result.data.checks;
    }
  }, {
    key: 'doRequest',
    value: function doRequest(options) {
      options.withCredentials = this.withCredentials;
      // options.headers = this.headers;

      return this.backendSrv.datasourceRequest(options);
    }
  }, {
    key: 'buildQueryParameters',
    value: function buildQueryParameters(options) {
      var _this2 = this;

      //remove placeholder targets
      options.targets = _lodash2.default.filter(options.targets, function (target) {
        return target.target !== 'select metric';
      });

      var targets = _lodash2.default.map(options.targets, function (target) {
        return {
          target: _this2.templateSrv.replace(target.target, options.scopedVars, 'regex'),
          refId: target.refId,
          hide: target.hide,
          type: target.type || 'timeserie'
        };
      });

      options.targets = targets;

      return options;
    }
  }, {
    key: 'getTagKeys',
    value: function getTagKeys(options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.doRequest({
          url: _this3.url + '/tag-keys',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }, {
    key: 'getTagValues',
    value: function getTagValues(options) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.doRequest({
          url: _this4.url + '/tag-values',
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
