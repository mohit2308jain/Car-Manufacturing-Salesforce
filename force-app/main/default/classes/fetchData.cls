public with sharing class fetchData {
    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getLaunchedCarModels() {
        return [SELECT Id, Name, Engine__c, Seats__c, Price__c, Car__r.Style__c, Car__r.Manufacturer__c FROM Car_Model__c WHERE Stage__c =: 'Launched' ORDER BY LastModifiedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getLaunchedCarModelBySearchTerm(String searchTerm) {
        String searchTermLike = '%'+searchTerm+'%';
        return [SELECT Id, Name, Engine__c, Seats__c, Price__c FROM Car_Model__c WHERE (Stage__c =: 'Launched' AND Name LIKE :searchTermLike) ORDER BY LastModifiedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getAllCarModels() {
        return [SELECT Id, Name, Engine__c, Seats__c, Price__c FROM Car_Model__c ORDER BY LastModifiedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car_Booking__c> getCarBookings() {
        return [SELECT Id, Name, Speakers__c, Diesel__c, Extra_Airbags__c, Car_Color__c,
            Account__c, Car_Model__c, Booking_Stage__c, Customer_Email__c, Total_Price__c FROM Car_Booking__c ORDER BY LastModifiedDate LIMIT 1];
    }
}