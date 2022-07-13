import { api, LightningElement, track, wire } from 'lwc';
import getWOList from '@salesforce/apex/techDashboard.getWOInfo';
import techId from '@salesforce/user/Id';
import customlabelWorkOrderTitle from "@salesforce/label/c.WorkOrderTitle";
import customlabelWorkOrdersNone from "@salesforce/label/c.WorkOrdersNone";
import customlabelWorkOrderDetailsTitle from "@salesforce/label/c.WorkOrderDetailsTitle";
import WORKORDER_OBJECT from '@salesforce/schema/WorkOrder';
import WORKTYPE_OBJECT from '@salesforce/schema/WorkType';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class techWOListView extends LightningElement {
    workordernumberlabel;
    subjectlabel;
    worktypenamelabel;
    worktypecategorylabel;
    labels = {
        customlabelWorkOrderTitle,
        customlabelWorkOrderDetailsTitle,
        customlabelWorkOrdersNone
    };
    @track WOData = [];
    @track errorData;
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
            this.worktypecategorylabel=data.fields.Work_Type_Category__c.label;
        }
    } 
    @wire(getWOList,{userId : techId})
    dataRecord({data, error}){
       if(data){
            this.WOData = data;
            console.log('wo data size listview ' + this.WOData.length);
       }
       else if(error){
           this.errorData = error;
       }
    }
     
     get hasRecords() {
        return this.WOData && this.WOData.length > 0;
     }
     get labelworkordernumber() {
        return this.workordernumberlabel;
     }
}