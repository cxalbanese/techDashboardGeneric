debugger;
import { api, LightningElement, track, wire } from 'lwc';
<<<<<<< HEAD
import getWOList from '@salesforce/apex/techDashboard.getWOInfo';
=======
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
//import getWOList from '@salesforce/apex/techDashboard.getWOInfo';
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
import techId from '@salesforce/user/Id';
import customlabelWorkOrderTitle from "@salesforce/label/c.WorkOrderTitle";
import customlabelContractWorkOrders from "@salesforce/label/c.ContractWorkOrders";
import customlabelSpotWorkOrders from "@salesforce/label/c.SpotWorkOrders"; 
import customlabelProjectWorkOrders from "@salesforce/label/c.ProjectWorkOrders";  


export default class getWOs extends LightningElement {
    @track wt1Label='';
    @track wt1Num=0;
    @track wt2Label='';
    @track wt2Num=0;
    @track wt3Label='';
    @track wt3Num=0;
    @track wt2Available=false;
    @track wt3Available=false;
    labels = {
    customlabelSpotWorkOrders,
    customlabelProjectWorkOrders,
    customlabelContractWorkOrders,
    customlabelWorkOrderTitle
};
<<<<<<< HEAD
    @track WOData = [];
    @track woMap = new Map();
    @track errorData;
    @wire(getWOList,{userId : techId})
    dataRecord({data, error}){
       if(data){
            this.WOData = data;
            let wtKey='None';
            let innerWoMap = this.woMap;
            this.WOData.forEach(WOFunction);
            function WOFunction(value) {
                if(value.WorkType && value.WorkType.Name) {
                    wtKey = value.WorkType.Name;
                }
                else {
                    wtKey = 'None';    
                }                
                if(innerWoMap.has(wtKey)) {
                    innerWoMap.set(wtKey,innerWoMap.get(wtKey)+1);
                }
                else {                       
                    innerWoMap.set(wtKey,1); 
                }                   
            }
            this.woMap = innerWoMap;
            let max=[];
            //find the largest value in the map of wt:numWO and store in wt1
            if(this.woMap.size>0) {
                max = [...this.woMap.entries()].reduce((accumulator, element) => {
                    return element[1] > accumulator[1] ? element : accumulator;
                    });
                this.wt1Label=max[0];
                this.wt1Num=max[1];
                //remove the largest value for the next pass
                this.woMap.delete(max[0]);
            }
            //find the next largest value in the map of wt:numWO and store in wt2
            if(this.woMap.size>0) {
                max = [...this.woMap.entries()].reduce((accumulator, element) => {
                    return element[1] > accumulator[1] ? element : accumulator;
                    });
                this.wt2Label=max[0];
                this.wt2Num=max[1];
                this.wt2Available=true;
                //remove the largest value for the next pass
                this.woMap.delete(max[0]);
            }
            //find the next largest value in the map of wt:numWO and store in wt3
            if(this.woMap.size>0) {
                max = [...this.woMap.entries()].reduce((accumulator, element) => {
                    return element[1] > accumulator[1] ? element : accumulator;
                    });
                this.wt3Label=max[0];
                this.wt3Num=max[1];
                this.wt3Available=true;
                //remove the largest value for the next pass - in case you add a 4th pass
                this.woMap.delete(max[0]);
            }
       }
       else if(error){
           this.errorData = error;
       }
=======
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
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
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
//      @wire(unstable_graphql, {
//         query: gql`
//         query WorkOrders {
//             uiapi {
//               query {
//                 ServiceAppointment(scope: ASSIGNEDTOME) @category(name: "recordQuery") {
//                   edges {
//                     node {
//                       Id
//                       ParentRecord @category(name: "polymorphicParentRelationship") {
//                         ... on WorkOrder {
//                           Id
//                           WorkOrderNumber @category(name: "StringValue") {
//                             value
//                           }
//                           WorkType  @category(name: "parentRelationship") {
//                             Name @category(name: "StringValue") {
//                               value
//                             }
//                             Work_Type_Category__c @category(name: "PicklistValue") {
//                               value
//                             }
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         `,
//     variables: '$variables',
// })
//     functionWOs ({ data, errors }) {
//         if (data) {
//               this.woData =data.uiapi.query.ServiceAppointment.edges.map(edge => edge.node.ParentRecord); 
//               this.woData = this.woData.filter(workorder=>workorder.WorkType);
//               if(this.woData && this.woData.length>0){
//                 this.woData.forEach(element => 
//                     {
//                         if(!this.uniqueWOIds.includes(element.Id)) {
//                             this.uniqueWOIds.push(element.Id);
//                             this.uniqueWOs.push(element);
//                         }
//                     });
//                 this.woData=this.uniqueWOs;
//               }
//                console.log('woData - ' + this.woData.length);
//           }
//         if(errors) {
//             this.errorData = errors;
//         }
//     }   
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
                  WorkType @category(name: "parentRelationship") {
                    Id
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
        console.log('inside of wo data');
            this.woData =data.uiapi.query.WorkOrder.edges.map(edge => edge.node); 
            // this.woData = this.woData.filter(workorder=>workorder.WorkType);
      }
      if(errors) {
          this.woErrorData = errors;
      }
  }   
    get woDataFound() {
        if(this.woData && this.woData.length && this.woData.length>0) return true;
        return false;
    } 
    get wt1FieldLabel() {
        if(this.wt1Label) {
            return this.wt1Label;
        }
        else {
            return '';
        }
    }
    get wt2FieldLabel() {
        if(this.wt2Label) {
            return this.wt2Label;
        }
        else {
            return '';
        }
    }
    get wt3FieldLabel() {
        if(this.wt3Label) {
            return this.wt3Label;
        }
        else {
            return '';
        }
    }
    get numContractWOs() {
        return(this.numWOCat('Battery Replacement'));
    }   
    get numProjectWOs() {
        return(this.numWOCat('Maintenance'));
    }    
    get numSpotWOs() {
        return(this.numWOCat('Installation'));
    }   
<<<<<<< HEAD

    numWOCat(cat) {        
=======
    numWOCat(cat) {
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
        let numCat=0;
        this.woData.forEach(WOFunction);
        function WOFunction(value) {
<<<<<<< HEAD
            if(value.WorkType && value.WorkType.Name) {
                if(value.WorkType.Name==cat) {
                    numCat++;
                }       
            }
=======
            if(value.WorkType && value.WorkType.Work_Type_Category__c) {
                if(value.WorkType.Work_Type_Category__c.value==cat) {
                    numCat++;
            }   }    
>>>>>>> d3534fafaa629d4b567466805d1a7cecbde6ef44
        }
        return numCat;
    }  
}