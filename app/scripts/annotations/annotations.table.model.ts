module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var AnnotationsTableModel:TableiciousConfig = {
        title: "Annotations",
        order: ['annotation_id', 'participant_id', 'project.program.name', 'project.project_id', 'entity_id', 'entity_type', 'category', 'classification', 'dateCreated', 'creator', 'status', 'entity_submitter_id'],
        headings: [{
            displayName: "ID",
            id: "annotation_id",
            sref: function (field) {
                return {
                    state: "/annotations/" + field.val
                };
            },
            sortable: true,
          fieldClass: 'truncated-cell'
        },
        {
            displayName: "Participant ID",
            id: "participant_id",
            sref: function (field) {
              return {
                state: "/participants/" + field.val
              }
            },
            sortable: true,
          fieldClass: 'truncated-cell'
        },
        {
            displayName: "Program",
            id: "project.program.name",
            sortable: true,
            hidden:true
        },
        {
            displayName: "Project",
            id: "project.project_id",
            sref: function (field, row) {
                var project = _.find(row, (a) => {
                    return a.id === "project";
                });
                return {
                    state: "/projects/" + project.val.project_id
                };
            },
            sortable: true
        },
        {
            displayName: "Entity Type",
            id: "entity_type",
            template: function (field, row, scope, $filter) {
                return $filter("humanify")(field && field.val || "--");
            },
            sortable: true
        },
        {
            displayName: "Entity ID",
            id: "entity_id",
            template: function (field) {
                return field && field.val || "--";
            },
            sortable: true,
            fieldClass: 'truncated-cell'
        },
        {
            displayName: "Entity Barcode",
            id: "entity_submitter_id",
            sortable: true,
            template: function(field) {
                return field && field.val || "--";
            },
            hidden:true
        },
        {
            displayName: "Category",
            id: "category",
            template: function(field,row,scope) {
              return scope.$filter('ellipsicate')(field.val, 30);
            },
            sortable: true
        },
        {
            displayName: "Classification",
            id: "classification",
            template: function(field) {
                var original = field.val;
                original = original.split(/(?=[A-Z])/).join(" ");

                return original;
            },
            sortable: true
        },
        {
            displayName: "Created Date",
            id: "created_datetime",
            template:function(field,row,scope, $filter){
                // The value given appears to be in seconds rather than milliseconds
                return $filter('date')(field.val * 1000);
            }
        },
        {
            displayName: "Annotator",
            id: "creator",
            template: function(field, row, scope, $filter) {
                return $filter("humanify")(field.val);
            },
            sortable: true,
            hidden: true
        },
        {
            displayName: "Status",
            id: "status",
            sortable: true
        }
        ],
        fields: [
          "annotation_id",
          "category",
          "created_datetime",
          "creator",
          "status",
          "entity_type",
          "entity_id",
          "entity_submitter_id",
          "notes",
          "classification",
          "project.program.name",
          "project.project_id",
          "participant_id"
        ]
    }
    angular.module("annotations.table.model", [])
        .value("AnnotationsTableModel", AnnotationsTableModel);
}
