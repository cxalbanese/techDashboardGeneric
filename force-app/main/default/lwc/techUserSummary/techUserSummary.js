import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getSRObj from '@salesforce/apex/techDashboard.getSRInfo';
import techId from '@salesforce/user/Id';

export default class getSRInfo extends LightningElement {
    @track srData = [];
    @track errorData;
    @wire(getSRObj,{userId : techId})
    dataRecord({data, error}){
        if(data){
            this.srData = data;
        }
        else if(error){
            this.errorData = error;
        }
    }
    get techName() {
        return this.srData.Name;
    }   
    get techLastDate() {
        return this.srData.LastKnownLocationDate;
    }   
}