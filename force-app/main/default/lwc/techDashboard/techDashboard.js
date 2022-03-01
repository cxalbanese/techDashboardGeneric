import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';

export default class LwcUserDetail extends LightningElement {

    get myUserId() {
        return Id;
    }
    
}