module ngApp.projects {
  "use strict";

  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IProject = ngApp.projects.models.IProject;

  /* ngInject */
  function projectsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("projects", {
      url: "/projects",
      controller: "ProjectsController as prsc",
      templateUrl: "projects/templates/projects.html",
      reloadOnSearch: false
    });

    $stateProvider.state("project", {
      url: "/projects/:projectId",
      controller: "ProjectController as prc",
      templateUrl: "projects/templates/project.html",
      resolve: {
        project: ($stateParams: ng.ui.IStateParamsService, ProjectsService: IProjectsService): ng.IPromise<IProject> => {
          return ProjectsService.getProject($stateParams["projectId"], {
            fields: [
              "code",
              "name",
              "summary.data_types.file_count",
              "summary.data_types.data_type",
              "summary.data_types.participant_count",
              "summary.experimental_strategies.file_count",
              "summary.experimental_strategies.participant_count",
              "summary.experimental_strategies.experimental_strategy",
              "summary.participant_count",
              "summary.file_size",
              "summary.file_count",
              "state",
              "program.name",
              "program.program_id",
              "primary_site",
              "project_id"
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.projects", [
        "projects.controller",
        "tables.services",
        "ui.router.state"
      ])
      .config(projectsConfig);
}
