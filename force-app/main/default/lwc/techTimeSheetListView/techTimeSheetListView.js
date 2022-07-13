import { api, LightningElement, track, wire } from 'lwc';
import getTSEList from '@salesforce/apex/techDashboard.getTSList';
import techId from '@salesforce/user/Id';
import customlabelTimeSheetEntriesNone from "@salesforce/label/c.TimeSheetEntriesNone";
import customlabelTimeSheetEntryDetailsTitle from "@salesforce/label/c.TimeSheetEntryDetailsTitle";
import TIMESHEET_OBJECT from '@salesforce/schema/TimeSheet';
import TIMESHEETENTRY_OBJECT from '@salesforce/schema/TimeSheetEntry';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class techTimeSheetListView extends LightningElement {
    timesheetnumberlabel;
    timesheetentrynumberlabel;
    typelabel;
    starttimelabel;
    endtimelabel;
    labels = {
        customlabelTimeSheetEntryDetailsTitle,
        customlabelTimeSheetEntriesNone
    };
    @track tseData = [];
    @track errorData;
    @wire(getObjectInfo, { objectApiName: TIMESHEET_OBJECT })
    tsInfo({ data, error }) {
        if (data) {
            this.timesheetnumberlabel=data.fields.TimeSheetNumber.label;
        }
    }
   @wire(getObjectInfo, { objectApiName: TIMESHEETENTRY_OBJECT })
    tseInfo({ data, error }) {
        if (data) {
            this.timesheetentrynumberlabel=data.fields.TimeSheetEntryNumber.label;
            this.typelabel=data.fields.Type.label;
            this.starttimelabel=data.fields.StartTime.label;
            this.endtimelabel=data.fields.EndTime.label;
        }
    } 
    @wire(getTSEList,{userId : techId})
    dataRecord({data, error}){
       if(data){
            this.tseData = data;
       }
       else if(error){
           this.errorData = error;
       }
    }
     get hasRecords() {
        return this.tseData && this.tseData.length > 0;
     }
}