public with sharing class fetchData {
    
    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getLaunchedCarModels() {
        return [SELECT Id, Name, Car__c, Engine__c, Seats__c, Price__c, Stage__c, Car__r.Name, Car__r.Style__c, Car__r.Manufacturer__c FROM Car_Model__c WHERE Stage__c =: 'Launched' ORDER BY LastModifiedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car_Booking__c> getCarBookings() {
        return [SELECT Id, Name, Speakers__c, Diesel__c, Extra_Airbags__c, Car_Color__c, 	IsApproved__c,
            Account__c, Account__r.Name, Car_Model__c, Car_Model__r.Name, Booking_Stage__c, Customer_Email__c, Total_Price__c FROM Car_Booking__c ORDER BY LastModifiedDate];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getManufacturedCarModels() {
        return [SELECT Id, Name, Car__c, Engine__c, Seats__c, Price__c, Stage__c, Car__r.Name, Car__r.Style__c, Car__r.Manufacturer__c FROM Car_Model__c WHERE Stage__c =: 'Manufactured' ORDER BY LastModifiedDate DESC];
    }
}