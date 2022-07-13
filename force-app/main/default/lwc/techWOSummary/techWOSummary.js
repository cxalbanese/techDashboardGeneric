import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getWOList from '@salesforce/apex/techDashboard.getWOInfo';
import techId from '@salesforce/user/Id';
import customlabelWorkOrderTitle from "@salesforce/label/c.WorkOrderTitle";
import customlabelContractWorkOrders from "@salesforce/label/c.ContractWorkOrders";
import customlabelSpotWorkOrders from "@salesforce/label/c.SpotWorkOrders"; 
import customlabelProjectWorkOrders from "@salesforce/label/c.ProjectWorkOrders";  

export default class getWOs extends LightningElement {
    labels = {
    customlabelSpotWorkOrders,
    customlabelProjectWorkOrders,
    customlabelContractWorkOrders,
    customlabelWorkOrderTitle
};
    @track WOData = [];
    @track errorData;
    @wire(getWOList,{userId : techId})
    dataRecord({data, error}){
       if(data){
            this.WOData = data;
            console.log('wo data size ' + this.WOData.length);
       }
       else if(error){
           this.errorData = error;
       }
     }

    get numWOs() {
        return this.WOData.length;
    } 
    get numContractWOs() {
        return(this.numWOCat('Contract'));
    }   
    get numProjectWOs() {
        return(this.numWOCat('Project'));
    }    
    get numSpotWOs() {
        return(this.numWOCat('Spot'));
    }   

    numWOCat(cat) {
        let numCat=0;
        this.WOData.forEach(WOFunction);
        function WOFunction(value) {
            if(value.WorkType.Work_Type_Category__c==cat) {
                numCat++;
            }       
        }
        return numCat;
    }  
}