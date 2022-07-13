import { api, LightningElement, track, wire } from 'lwc';
import getSAList from '@salesforce/apex/techDashboard.getSAInfo';
import techId from '@salesforce/user/Id';
import customlabelServiceAppointmentTitle from "@salesforce/label/c.ServiceAppointmentTitle";
import customlabelServiceAppointmentsNone from "@salesforce/label/c.ServiceAppointmentsNone";
import customlabelSADetailsTitle from "@salesforce/label/c.SADetailsTitle";
import SERVICEAPPOINTMENT_OBJECT from '@salesforce/schema/ServiceAppointment';
import WORKORDER_OBJECT from '@salesforce/schema/WorkOrder';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class techSAListView extends LightningElement {
    workordernumberlabel;
    subjectlabel;
    statuslabel;
    appointmentnumberlabel;
    schedstarttimelabel;
    schedendtimelabel;
    labels = {
        customlabelServiceAppointmentTitle,
        customlabelSADetailsTitle,
        customlabelServiceAppointmentsNone
    };
    @track saData = [];
    @track errorData;
    @wire(getObjectInfo, { objectApiName: WORKORDER_OBJECT })
    woInfo({ data, error }) {
        if (data) {
            this.workordernumberlabel=data.fields.WorkOrderNumber.label;
        }
    }
   @wire(getObjectInfo, { objectApiName: SERVICEAPPOINTMENT_OBJECT })
    saInfo({ data, error }) {

        if (data) {
            this.subjectlabel=data.fields.Subject.label;
            this.statuslabel=data.fields.Status.label;
            this.appointmentnumberlabel=data.fields.AppointmentNumber.label;
            this.schedstarttimelabel=data.fields.SchedStartTime.label;
            this.schedendtimelabel=data.fields.SchedEndTime.label;
        }
    } 
    @track saData = [];
    @track errorData;
    labels = {
        customlabelServiceAppointmentTitle
    };
    @wire(getSAList,{userId : techId})
    dataRecord({data, error}){
        if(data){
            this.saData = data;
        }
        else if(error){
            this.errorData = error;
        }
    }
    get numOpenSAs() {
        return this.saData.length;
    }   
     
     get hasRecords() {
        return this.saData && this.saData.length > 0;
     }
}