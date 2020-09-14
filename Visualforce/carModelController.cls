public class carModelController {
    public string accId {get; set;}
    public List<Car_Model__c> CarModels {get; set;}
    
    public carModelController (){
        LoadData();
    }
    
    private void LoadData(){
        CarModels = [SELECT Id, Name, Engine__c, Seats__c, Price__c, Stage__c FROM Car_Model__c ORDER BY LastModifiedDate DESC];
    }
    
    public void updateModels(){
        try{
      		update CarModels;
    	}
        Catch (DMLException e) {
      		ApexPages.addMessages(e);
      		//return null;
    	}
        LoadData();
    }
    
    public void updateToManufactured(){
        if (accId == null){
            return;
        }
        
        Car_Model__c tobeUpdated = null;
        for(Car_Model__c model: CarModels){
            if(model.Id == accId){
                tobeUpdated = model;
                break;
            }
        }
        
        if(tobeUpdated != null){
            tobeUpdated.Stage__c = 'Manufactured';
            update tobeUpdated;
        }
        LoadData();
    }
    
    public void DeleteCarModel(){
        if (accId == null){
            return;
        }
        
        Car_Model__c tobeDeleted = null;
        for(Car_Model__c model: CarModels){
            if(model.Id == accId){
                tobeDeleted = model;
                break;
            }
        }
        
        if(tobeDeleted != null){
            Delete tobeDeleted;
        }
        LoadData();
    }   
}