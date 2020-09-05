import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getAllCarModels from '@salesforce/apex/fetchData.getAllCarModels';

import CARMODELID from '@salesforce/schema/Car_Model__c.Id';
import CARMODELNAME from '@salesforce/schema/Car_Model__c.Name';
import CARFIELD from '@salesforce/schema/Car_Model__c.Car__c';
import CARSEATS from '@salesforce/schema/Car_Model__c.Seats__c';
import CARENGINE from '@salesforce/schema/Car_Model__c.Engine__c';
import CARPRICE from '@salesforce/schema/Car_Model__c.Price__c';

const COLS = [
    { label: 'Car Model Name', fieldName: 'Name' },
    { label: 'Engine', fieldName: 'Engine__c'},
    { label: 'Seats', fieldName: 'Seats__c' },
    { label: 'Price', fieldName: 'Price__c' }
]

export default class CreateCarModel extends LightningElement {
    carmodelname_field = CARMODELNAME;
    car_field = CARFIELD;
    carengine_field = CARENGINE;
    carseats_field = CARSEATS;
    carprice_field = CARPRICE;

    @track showCarModels = true;
    @track showCarModelForm = false;
    @track columns = COLS;
    @track carModels;
    @track error;

    @wire(getAllCarModels)
    Car_Model__c(result){
        console.log(result);
        if(result.data){
            this.carModels = result.data;
            this.error = undefined;
            console.log("ll");
            console.log(this.carModels);
        }
        else{
            this.carModels = undefined;
            this.error = result.error;
            console.log("gg");
            console.log(this.error);
        }
    }


    createCarModel = (event) => {
        console.log(event.detail.id);
        //this.bookingId = event.detail.id;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'CarModel Created !',
            variant: 'success'
        }));
        location.reload();
    }

    clear = (event) => {
        this.template.querySelector('form').reset();
    }

    showFormView = (event) => {
        this.showCarModelForm = true;
        this.showCarModels = false;
    }

    showListView = (event) => {
        this.showCarModelForm = false;
        this.showCarModels = true;
    }
}