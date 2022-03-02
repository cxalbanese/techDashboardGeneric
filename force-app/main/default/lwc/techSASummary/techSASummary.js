import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getSAList from '@salesforce/apex/techDashboard.getSAInfo';
import techId from '@salesforce/user/Id';

export default class getSAs extends LightningElement {
    @track saData = [];
    @track errorData;
    @wire(getSAList,{userId : techId})
    dataRecord({data, error}){
        if(data){
            this.saData = data;
            refreshApex(this.getSAList);
        }
        else if(error){
            this.errorData = error;
        }
    }
    get numOpenSAs() {
        return this.saData.length;
    }   
}