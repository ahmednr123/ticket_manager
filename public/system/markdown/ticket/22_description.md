## Routes

**/user/check**   
Input: {account_id}   
Output: Bool *[if user exists or not]*

**/user/create**   
Input: {account_id, password}   
Output: Bool *[if user is created]*

**/user/login**   
Input: {account_id, password}   
Output: Token *[Session token]*