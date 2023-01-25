import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
import customlabelWorkOrderTitle from "@salesforce/label/c.WorkOrderTitle";
import customlabelWorkOrdersNone from "@salesforce/label/c.WorkOrdersNone";
import customlabelWorkOrderDetailsTitle from "@salesforce/label/c.WorkOrderDetailsTitle";
import WORKORDER_OBJECT from '@salesforce/schema/WorkOrder';
import WORKTYPE_OBJECT from '@salesforce/schema/WorkType';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import customlabelBackTitle from "@salesforce/label/c.Back";

export default class techWOListView extends LightningElement {
    workordernumberlabel;
    subjectlabel;
    worktypenamelabel;
    labels = {
        customlabelWorkOrderTitle,
        customlabelWorkOrderDetailsTitle,
        customlabelWorkOrdersNone,
        customlabelBackTitle
    };
<<<<<<< HEAD
<<<<<<< HEAD
    @track WOData = [];
    @track WODataCleansed=[];
    @track errorData;
=======
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
=======
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
    @wire(getObjectInfo, { objectApiName: WORKORDER_OBJECT })
    woInfo({ data, error }) {
        console.log('insdie of work order labels data ' + data);

        if (data) {
            this.workordernumberlabel=data.fields.WorkOrderNumber.label;
            this.subjectlabel=data.fields.Subject.label;
        }
    }
   @wire(getObjectInfo, { objectApiName: WORKTYPE_OBJECT })
    wtInfo({ data, error }) {

        if (data) {
            this.worktypenamelabel=data.fields.Name.label;
        }
    } 
<<<<<<< HEAD
<<<<<<< HEAD
    @wire(getWOList,{userId : techId})
    dataRecord({data, error}){
        if(data){
            this.WOData = data;
            //loop through the data and if there is no work type name set to blank
            this.WOData.forEach(wo =>
                {
                    let woRow = wo;                   
                    if(!woRow.WorkType)  {
                        let WorkType = {Name: ''};
                        woRow = { ...woRow, WorkType };
                    }
                    this.WODataCleansed.push(woRow);
                } )
        }
        else if(error){
            this.errorData = error;
        }
=======
=======
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
    woData=[];
    saData=[];
    errorData;
    woErrorData;
    statusCategories=["Scheduled","Dispatched"]
    uniqueWOIds=[];
    uniqueWOs=[];
    get variables() {
        return { 
                 statusCats : this.statusCategories};
     }
    get variablesWO() {
      return {
        woIds: this.saData
      };
    }
     @wire(unstable_graphql, {
      query: gql`
      query ServiceAppointments ($statusCats: [Picklist]) {
          uiapi {
            query {
              ServiceAppointment (
                scope: ASSIGNEDTOME,
                where: {StatusCategory: {in: $statusCats}}
              ) 
              @category(name: "recordQuery") {
                edges {
                  node {
                    Id
                    ParentRecordId @category(name: "StringValue") {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
  variables: '$variables',
})
  functionSAs ({ data, errors }) {
      if (data) {
            this.saData =data.uiapi.query.ServiceAppointment.edges.map(edge => edge.node.ParentRecordId.value); 
             console.log('saData - ' + this.saData.length);
        }
      if(errors) {
          this.errorData = errors;
      }
  } 
  @wire(unstable_graphql, {
    query: gql`
    query WorkOrders($woIds: [ID]) {
      uiapi {
        query {
          WorkOrder(where: {Id: {in: $woIds}}) @category(name: "recordQuery") {
            edges {
              node {
                Id
                WorkOrderNumber @category(name: "StringValue") {
                  value
                }
                Subject @category(name: "StringValue") {
                    value
                }
                WorkType @category(name: "parentRelationship") {
                  Id
                  Name @category(name: "StringValue") {
                    value
                  }
                  Work_Type_Category__c @category(name: "PicklistValue") {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
variables: '$variablesWO',
})
functionWOs ({ data, errors }) {
    if (data) {
          this.woData =data.uiapi.query.WorkOrder.edges.map(edge => edge.node); 
    }
    if(errors) {
        this.woErrorData = errors;
<<<<<<< HEAD
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
=======
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
    }
}
     get hasRecords() {
        return this.woData && this.woData.length > 0;
     }
     get labelworkordernumber() {
        return this.workordernumberlabel;
     }
}