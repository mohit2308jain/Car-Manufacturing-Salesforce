import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import getManufacturedCarModels from '@salesforce/apex/fetchData.getManufacturedCarModels';

import CARMODELID from '@salesforce/schema/Car_Model__c.Id';
import CARMODELNAME from '@salesforce/schema/Car_Model__c.Name';
import CARMODELSTAGE from '@salesforce/schema/Car_Model__c.Stage__c'
import CARFIELD from '@salesforce/schema/Car_Model__c.Car__c';
import CARSEATS from '@salesforce/schema/Car_Model__c.Seats__c';
import CARENGINE from '@salesforce/schema/Car_Model__c.Engine__c';
import CARPRICE from '@salesforce/schema/Car_Model__c.Price__c';

const COLS = [
    { label: 'Car Model Name', fieldName: 'Name' },
    { label: 'Engine', fieldName: 'Engine__c'},
    { label: 'Seats', fieldName: 'Seats__c' },
    { label: 'View', type: 'button-icon', initialWidth: 75,
        typeAttributes: {
            label: 'Show',
            name: 'showRec',
            iconName: 'action:info',
            title: 'Info',
            variant: 'border-filled',
            alternativeText: 'View'
        }
    },
    { label: 'Change Stage to Launched', type: 'button',
        typeAttributes: {
            label: 'Yes',
            name: 'update',
            title: 'Update',
            variant: 'success'
        }
    },
]

export default class CarModelQAPage extends LightningElement {
    carmodelname_field = CARMODELNAME;
    car_field = CARFIELD;
    carengine_field = CARENGINE;
    carseats_field = CARSEATS;
    carprice_field = CARPRICE;

    @track columns = COLS;
    @track showViewModal = false;
    @track showUpdateModal = false;
    @track viewRecId;
    @track idForFile;
    @track carModels;
    @track error;
    @track carModel;
    @track datas;
    @track len = false;

    constructor(){
        super();
        getManufacturedCarModels()
        .then((result) => {
            this.carModels = result;
            this.datas = result;
            this.setLen(result.length);
        }) 
        .catch((error) => {
            this.error = error;
            this.showErrorToast(error);
        })
    }

    setLen = (res) => {
        this.len = (res) ? true : false;
    }

    showErrorToast = (err) => {
        const event = new ShowToastEvent({
            title: 'Error',
            variant: 'error',
            message: err.body.message,
        });
        this.dispatchEvent(event);
    }

    //Function used to fetch records according to the value given as input in the searchbar
    searchRecords = (event) => {
        const searchTerm = event.target.value;
        
        if(searchTerm){
            this.carModels = this.carModels.filter((model) => {
                return model.Name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            this.setLen(this.carModels.length);
        }
        else if(!searchTerm){
            this.carModels = this.datas;
            this.setLen(this.carModels.length);
        }
    }

    handleRowActions = (event) => {
        const row = event.detail.row;

        if(event.detail.action.name==='showRec') {
            this.carModel = row;
            this.openViewModal();
        }
        else if(event.detail.action.name==='update'){
            this.idForFile = event.detail.row.Id;
            this.openUpdateModal();
        }

    }

    get acceptedFormats() {
        return ['.pdf', '.docx', '.doc'];
    }

    handleUploadFinished = (event) => {
        const uploadedFiles = event.detail.files;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'File Uploaded',
                variant: 'success'
            })
        );
        this.updateToLaunched()
    }

    updateToLaunched = () => {
        const fields = {}
        fields[CARMODELID.fieldApiName] = this.idForFile;
        fields[CARMODELSTAGE.fieldApiName] = 'Launched';
        
        const recordInput = {fields};
        updateRecord(recordInput).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Car Launched',
                    variant: 'success'
                })
            );
            location.reload();
        }).catch((error) => {
            if(error.status === 404 && error.body.message === 'The requested resource does not exist'){
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Car Launched',
                    variant: 'success'
                })
                location.reload();
            }
            else{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error occured in updating stage',
                        variant: 'error'
                    })
                );
            }
        })
    }

    openViewModal = () => {
        this.showViewModal = true;
        this.showUpdateModal = false;
    }

    closeViewModal = (event) => {
        this.showViewModal = false;
        this.showUpdateModal = false;
        this.idForFile = '';
    }

    openUpdateModal = () => {
        this.showUpdateModal = true;
        this.showViewModal = false;
    }

    closeUpdateModal = (event) => {
        this.showUpdateModal = false;
        this.showViewModal = false;
        this.idForFile = '';
    }
}