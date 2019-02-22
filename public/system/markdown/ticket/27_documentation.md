### Tokens Table
### Table Description

**token**   
Datatype: text

**account_id**   
Datatype: varchar(100)   
Foreign key: users(account_id)   
ON DELETE CASCADE

**type**   
Datatype: varchar(100)

**birthday**   
Datatype: datetime

**deathday**    
Datatype: datetime