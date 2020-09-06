import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';

import BOOKINGID from '@salesforce/schema/Car_Booking__c.Id';
import BOOKINGSTAGE from '@salesforce/schema/Car_Booking__c.Booking_Stage__c';
import CARCOLOR from '@salesforce/schema/Car_Booking__c.Car_Color__c';
import CUSTOMERACCOUNT from '@salesforce/schema/Car_Booking__c.Account__c';
import CUSTOMEREMAIL from '@salesforce/schema/Car_Booking__c.Customer_Email__c';
import SPEAKERS from '@salesforce/schema/Car_Booking__c.Speakers__c';
import DIESEL from '@salesforce/schema/Car_Booking__c.Diesel__c';
import AIRBAGS from '@salesforce/schema/Car_Booking__c.Extra_Airbags__c';
import TOTALPRICE from '@salesforce/schema/Car_Booking__c.Total_Price__c';
import CARMODEL from '@salesforce/schema/Car_Booking__c.Car_Model__c'

export default class CarBookingPage extends NavigationMixin(LightningElement) {
    @api recId;

    bookingstage_field = BOOKINGSTAGE;
    carcolor_field = CARCOLOR;
    customeracc_field = CUSTOMERACCOUNT;
    cusemail_field = CUSTOMEREMAIL;
    speakers_field = SPEAKERS;
    diesel_field = DIESEL;
    airbags_field = AIRBAGS;
    totalprice_field = TOTALPRICE;
    carmodel_field = CARMODEL;

    @track showPaymentModal = false;
    @track showDeleteModal = false;
    @track showBookingForm = true;
    @track showBookingRecord = false;
    @track bookingId;
    @track pagetitle = 'Add Car Booking';

    createCarBooking = (event) => {
        console.log(event.detail.id);
        this.bookingId = event.detail.id;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Request Created !',
            variant: 'success'
        }));
        this.showBookingForm = false;
        this.showBookingRecord = true;
        this.pagetitle = 'Your Booking Details';
        //location.reload();
    }

    clear = (event) => {
        this.template.querySelector('form').reset();
    }

    navigateToCarModelsPage = () => {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                //Name of any CustomTab. Visualforce tabs, web tabs, Lightning Pages, and Lightning Component tabs
                apiName: 'Book_A_Car'
            },
        });
    }

    completePayment = () => {
        const fields = {}
        fields[BOOKINGID.fieldApiName] = this.bookingId;
        fields[BOOKINGSTAGE.fieldApiName] = 'Payment Done';
        
        const recordInput = {fields};
        updateRecord(recordInput).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Status Updated to ' + status,
                    variant: 'success'
                })
            );
            this.navigateToCarModelsPage();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error occured in updating status',
                    variant: 'error'
                })
            );
        })
    }

    openPaymentModal = (event) => {
        this.showPaymentModal = true;
        this.showDeleteModal = false;
    }

    closePaymentModal = (event) => {
        this.showPaymentModal = false;
        this.showDeleteModal = false;
    }

    cancelBooking = () => {
        deleteRecord(this.bookingId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Booking Cancelled',
                        variant: 'success'
                    })
                );
                this.navigateToCarModelsPage();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: 'Cannot Delete',
                        variant: 'error'
                    })
                );
            });
        console.log('delete');
    }

    openDeleteModal = (event) => {
        this.showDeleteModal = true;
        this.showPaymentModal = false;
    }

    closeDeleteModal = (event) => {
        this.showPaymentModal = false;
        this.showDeleteModal = false;
    }

}