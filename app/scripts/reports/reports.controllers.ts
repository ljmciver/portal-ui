module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;

  export interface IReportsController {
    reports: IReports;
  }
  export interface IReportController {
    report: IReport;
  }

  class ReportsController implements IReportsController {

    /* @ngInject */
    constructor(private CoreService: ICoreService, $scope,ReportsService, $q,ProjectsService,$timeout) {

      CoreService.setPageTitle("Reports");

      ReportsService.getReports().then(function(reports){
        CoreService.setSearchModelState(true);





        var dummymap = reports.hits.hits.map(function(z){
          return z._source;
        });

        var x = ['ACC','AGG','LUAD','LUSC','BCC',"COAD","CESC","PRAD",'READ','SKCM','STAD'];
        var t = ['Ovary','Skin','Brain','Heart','Lung'];

        x.forEach(function(g){
          var n = _.clone(dummymap[0]);
          n.code = g;
          n.count += Math.floor(Math.random() * 1000);
          n.primary_site = _.sample(t);
          n.size_in_mb += Math.floor(Math.random() * 1000);
          dummymap.push(n);
        })



        var dummy_aggregations = dummymap.reduce(function(a,b){

          if (!_.contains(primary_sites,b.primary_site)){
            primary_sites.push(b.primary_site);
          }
          if (a[b.code]) {
            var c = a[b.code];
            c.file_size += b.size_in_mb;
            c.file_count += b.count;

            b.data_types.forEach(function(d){
              c[d.data_type] += d.count;
            })


          } else {
            a[b.code] = {
              file_size:b.size_in_mb,
              code:b.code,
              primary_site:b.primary_site,
              file_count:b.count,
              colorgroup:'file_count'

            }

            b.data_types.forEach(function(d){
              a[b.code][d.data_type] = d.count;
            })
          }



          return a;
        },{});
        
          var color = d3.scale.category10()

        var columns = [{
          id:'code',
          display_name:["Project","Code"],
          scale:'ordinal',
          dimensional:true
        },
          {
            id:'file_count',
            display_name:["File","Count"],
            scale:'ordinal',
            dimensional:true,
            colorgroup:'file_count'
          },

          {
            id:'file_size',
            display_name:["File","Size"],
            scale:'ordinal',
            dimensional:true,
            colorgroup:'file_size'
          },
          {
            id:'primary_site',
            display_name:["Primary","Site"],
            scale:'linear',
            dimensional:true
          }];

        var data_types = dummymap.reduce(function(a,b){return a.concat(b.data_types)},[])
        var nest = d3.nest().key(function(a){return a.data_type}).entries(data_types);

        nest.forEach(function(a){
          columns.splice(2,0,{
            id:a.key,
            display_name:[a.key],
            colorgroup:'file_count',
            scale:'ordinal',
            dimensional:true
          });
        });



        var config = {

          /* the id of the tag the table will be generated into */
          container:"#pc",

          /* default scale value, not useful */
          scale:"ordinal",

          /* Ordered list of columns. Only titles appearing here appear in the table */
          columns:columns.map(function(c){return c.id}),

          /* ???
           * The value that all the other values are divided by?
           * Has something to do with dimensions?
           **/
          ref:"lang_usage",

          /**
           * No idea what title_column does.
           **/
          title_column:"code",

          /**
           * Not really a scale map, more a map of what kind of column it will be.
           * Ordinal is the more geometry-oriented choice
           */
          scale_map:columns.reduce(function(a,b){
            a[b.id] = b.scale || 'ordinal';
            return a;
          },{}),

          /**
           * Interconnected with ref and dimension, possibly.
           * No idea what this does, really.
           */
          use:{
            "code":"code"
          },
           sorting:{
            "code":d3.descending,
            "primary_site":d3.ascending
          },

          /**
           *  Don't know what "d" is here.
           *  If defined for a column, formats the labels.
           *  Might not be implemented anywhere.
           */
          formats:{
            "primary_site":"d"
          },
            color_group_map:columns.reduce(function(a,b){
       a[b.id] = b.colorgroup;
       return a;
    },{}),
        color_groups:{
          'file_count':color(0),
          'file_size':color(1),
          'participant_count':color(2)

        },

          /**
           *  Not known what this is. Any values in columns that are not in dimensions causes an error.
           */
          dimensions:columns.filter(function(c){return c.dimensional}).map(function(c){return c.id}),

          /**
           *  Name for each column.
           **/
          column_map:columns.reduce(function(a,b){
            a[b.id] = b.display_name || ['Untitled'];
            return a;
          },{}),

          /**
           * Related to animation
           */
          duration:1000,
        };

        $timeout(function(){






          $scope.githutConfig = config;
          $scope.githutData = d3.values(dummy_aggregations);
          
              pc=new ParallelCoordinates(d3.values(dummy_aggregations),config);
        },500);



        $scope.byProject = dataNest('code').entries(dummymap);
        $scope.byDisease = dataNest('disease_type').entries(dummymap);
        $scope.byProgram = dataNest('program').entries(dummymap);

        $scope.byDataType = dataNest('data_type').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.data_types);
          return a;
        },[]));

        $scope.byStrat = dataNest('experimental_strategy').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.experimental_strategies);
          return a;
        },[]));

        $scope.byUserType = dataNest('user_type').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.user_types);
          return a;
        },[]));

        $scope.byLocation = dataNest('country').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.countries);
          return a;
        },[]));


        function dataNest(key){
          return d3.nest()
              .key(function(d){return d[key]})
              .rollup(function(d){
                return {
                  file_count:d3.sum(d.map(function(x){return x.count})),
                  file_size:d3.sum(d.map(function(x){return x.size_in_mb})),
                }
              })
              .sortValues(function(a,b){return a.file_count - b.file_count});

        }




      });
    }


  }

  class ReportController implements IReportController {

    /* @ngInject */
    constructor(public report: IReport, private CoreService: ICoreService, $timeout) {
      CoreService.setPageTitle("Report", report.id);

    }
  }

  angular
      .module("reports.controller", [
        "reports.services",
        "core.services"
      ])
      .controller("ReportController", ReportController)
      .controller("ReportsController", ReportsController);
}