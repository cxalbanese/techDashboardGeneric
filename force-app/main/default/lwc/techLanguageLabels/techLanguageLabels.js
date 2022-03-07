import customlabelopenoppty from "@salesforce/label/c.techOpenOppty";
import customlabelwonoppty from "@salesforce/label/c.techWonOppty"; 
import customlabelopptyheader from "@salesforce/label/c.techOpptyHeader"; 
import { LightningElement } from "lwc";

export default class CustomLabelExampleLWC extends LightningElement {
  mylabels = {
    customlabelopenoppty,
    customlabelwonoppty,
    customlabelopptyheader
};
}